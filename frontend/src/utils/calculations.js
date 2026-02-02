// Pairwise Netting Settlement Algorithm
export const calculateSettlement = (expenses, members) => {
  if (members.length < 2 || expenses.length === 0) {
    return [];
  }

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonShare = totalExpense / members.length;

  // Calculate net balance for each member
  const balances = {};
  members.forEach((member) => {
    const memberId = member._id || member.id;
    const paid = expenses
      .filter((e) => (e.payerId || e.payer_id) === memberId)
      .reduce((sum, e) => sum + e.amount, 0);
    balances[memberId] = paid - perPersonShare;
  });

  // Generate pairwise transactions
  const transactions = [];
  const memberIds = Object.keys(balances);
  
  // Create a debt map using canonical keys
  const debtMap = {};
  
  for (let i = 0; i < memberIds.length; i++) {
    for (let j = i + 1; j < memberIds.length; j++) {
      const id1 = memberIds[i];
      const id2 = memberIds[j];
      const key = id1 < id2 ? `${id1}|${id2}` : `${id2}|${id1}`;
      debtMap[key] = 0;
    }
  }

  // Calculate net flows
  expenses.forEach((expense) => {
    const payerId = expense.payerId || expense.payer_id;
    const amountPerPerson = expense.amount / members.length;

    members.forEach((member) => {
      const memberId = member._id || member.id;
      if (memberId !== payerId) {
        const key = memberId < payerId 
          ? `${memberId}|${payerId}` 
          : `${payerId}|${memberId}`;
        
        if (memberId < payerId) {
          debtMap[key] -= amountPerPerson; // member owes payer
        } else {
          debtMap[key] += amountPerPerson; // payer is owed by member
        }
      }
    });
  });

  // Convert debt map to transactions
  const memberMap = {};
  members.forEach((m) => {
    memberMap[m._id || m.id] = m.name;
  });

  Object.entries(debtMap).forEach(([key, amount]) => {
    if (Math.abs(amount) > 0.01) {
      const [id1, id2] = key.split('|');
      
      if (amount < 0) {
        transactions.push({
          debtorId: id1,
          debtorName: memberMap[id1],
          creditorId: id2,
          creditorName: memberMap[id2],
          amount: Math.abs(amount)
        });
      } else {
        transactions.push({
          debtorId: id2,
          debtorName: memberMap[id2],
          creditorId: id1,
          creditorName: memberMap[id1],
          amount: amount
        });
      }
    }
  });

  return transactions;
};
