export const calculateSettlement = (expenses, members) => {
  if (members.length < 2 || expenses.length === 0) {
    return [];
  }

  const memberMap = {};
  const balances = {};

  members.forEach((member) => {
    const memberId = member._id || member.id;
    memberMap[memberId] = member.name;
    balances[memberId] = 0;
  });

  expenses.forEach((expense) => {
    const payerId = expense.payerId || expense.payer_id;
    const excludedIds = new Set((expense.excludedMemberIds || []).map(String));
    let participantIds = members
      .map((member) => String(member._id || member.id))
      .filter((memberId) => !excludedIds.has(memberId));

    if (!participantIds.includes(String(payerId))) {
      participantIds = [String(payerId), ...participantIds];
    }

    if (participantIds.length === 0) return;

    const share = Number(expense.amount) / participantIds.length;

    balances[payerId] = (balances[payerId] || 0) + Number(expense.amount);
    participantIds.forEach((memberId) => {
      balances[memberId] = (balances[memberId] || 0) - share;
    });
  });

  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance < -0.01) {
      debtors.push({ memberId, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ memberId, amount: balance });
    }
  });

  const transactions = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      debtorId: debtor.memberId,
      debtorName: memberMap[debtor.memberId],
      creditorId: creditor.memberId,
      creditorName: memberMap[creditor.memberId],
      amount,
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) debtorIndex += 1;
    if (creditor.amount < 0.01) creditorIndex += 1;
  }

  return transactions;
};
