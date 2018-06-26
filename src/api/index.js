// import { v4 } from 'node-uuid';
import { mockAgreements, mockPlan } from '../tests/intergration/mockData';

const mockDatabase = {
  paginatedAgreements: mockAgreements,
  plan: mockPlan,
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAgreements = filter => (
  delay(500).then(() => {
    switch (filter) {
      case 'all':
        return mockDatabase.paginatedAgreements;
      // case 'complete':
      //   return mockDatabase.paginatedAgreements.agreements.filter(t => !t.draft);
      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  })
);

export const fetchPlan = () => (
  delay(500).then(() => {
    return mockDatabase.plan;
  })
);

// export const addTodo = (text) =>
//   delay(500).then(() => {
//     const todo = {
//       id: v4(),
//       text,
//       completed: false,
//     };
//     mockDatabase.todos.push(todo);
//     return todo;
//   });

// export const toggleTodo = (id) =>
//   delay(500).then(() => {
//     const todo = mockDatabase.todos.find(t => t.id === id);
//     todo.completed = !todo.completed;
//     return todo;
//   });
