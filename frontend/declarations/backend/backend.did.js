export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addScore' : IDL.Func([IDL.Nat], [], []),
    'getHighScores' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
