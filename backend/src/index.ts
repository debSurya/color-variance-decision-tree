import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import q from './questionnaireMap.json';
import s from './suggestions.json';
import { QueryArgs, Question } from './types';
import fs from 'fs';

// The GraphQL schema
const typeDefs = `#graphql
  type AnswerObj {
    key: String
    val: String
  }

  type Metadata {
    total: Int
  }

  type Question {
    key: String
    type: String
    question: String
    answers: [AnswerObj]
    next: Boolean
  }
  
  type Suggestion {
    suggestions: [String]
  }

  type Query {
    getQuestionnaireMetadata: Metadata
    getQuestion(qn: String, ans: [String]): Question
    getSuggestion: Suggestion
  }
`;

const storeAnswers = (question: string, answers: string[]) => {
  fs.readFile('./src/answers.json', (err: Error | null, data: Buffer) => {
    if (err) {
      fs.writeFileSync(
        './src/answers.json',
        JSON.stringify({ questionnaire: [{ question, answers }] }),
        'utf-8',
      );
    } else {
      const json = JSON.parse(data as unknown as string);
      json.questionnaire.push({ question, answers });
      fs.writeFileSync('./src/answers.json', JSON.stringify(json), 'utf-8');
    }
  });
};

const computeSuggestion = () => {
  const data = fs.readFileSync('./src/answers.json', 'utf-8');
  const answers = JSON.parse(data);
  const suggestions = s.suggestionsMap
    .filter((suggestionObj) => {
      return answers.questionnaire
        .find((aObj: { question: string }) => aObj.question === 'q6')
        .answers.includes(suggestionObj.combination.q6[0]);
    })
    .map((suggestionObj) => suggestionObj.value);
  fs.unlinkSync('./src/answers.json');
  return suggestions;
};

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getQuestionnaireMetadata: () => q.questionnaire.metadata,
    getQuestion: (_: Question, args: QueryArgs) => {
      if (!!args.qn) {
        storeAnswers(args.qn, args.ans);
      }
      if (!args.qn) {
        return {
          ...q.questionnaire.questions.find(
            (questionObj) => questionObj.key === 'q1',
          ),
          next: !!q.qMap.find((qMapObj) => qMapObj.key === 'q1')?.next,
        };
      } else {
        const mappedQ = q.qMap.find((qMapObj) => qMapObj.key === args.qn);
        if (!!mappedQ) {
          const qKeyToCheck = Array.isArray(mappedQ?.next)
            ? mappedQ?.next.find((nextQObj) =>
                args.ans.includes(nextQObj.forAns),
              )?.nextQ
            : mappedQ?.next;
          return {
            ...q.questionnaire.questions.find(
              (questionObj) => questionObj.key === qKeyToCheck,
            ),
            next: !!q.qMap.find((qMapObj) => qMapObj.key === qKeyToCheck)?.next,
          };
        } else {
          return null;
        }
      }
    },
    getSuggestion: () => ({
      suggestions: computeSuggestion(),
    }),
  },
};

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  // Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, () => {
      resolve(undefined);
    }),
  );
  console.log(`🚀 Server ready at http://localhost:4000`);
}

main();
