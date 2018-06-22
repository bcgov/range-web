// import { v4 } from 'node-uuid';

import paginatedFakeAgreements from './fakeAgreements';
import fakePlanWithAgreement from './fakePlan';

const fakeDatabase = {
  paginatedAgreements: paginatedFakeAgreements,
  plan: fakePlanWithAgreement,
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAgreements = filter =>
  delay(500).then(() => {
    switch (filter) {
      case 'all':
        return fakeDatabase.paginatedAgreements;
      // case 'complete':
      //   return fakeDatabase.paginatedAgreements.agreements.filter(t => !t.draft);
      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  });

export const fetchPlan = () =>
  delay(500).then(() => {
    return fakeDatabase.plan;
  });

// export const addTodo = (text) =>
//   delay(500).then(() => {
//     const todo = {
//       id: v4(),
//       text,
//       completed: false,
//     };
//     fakeDatabase.todos.push(todo);
//     return todo;
//   });

// export const toggleTodo = (id) =>
//   delay(500).then(() => {
//     const todo = fakeDatabase.todos.find(t => t.id === id);
//     todo.completed = !todo.completed;
//     return todo;
//   });
