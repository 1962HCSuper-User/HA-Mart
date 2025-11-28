import React from "react";
import SectionCard from "./SectionCard";

const TransactionsSection = () => {
  const transactions = [
    { title: "Payment to Nervfit", amount: "-₹2,249", time: "Nov 18 · Paid with card" },
    { title: "Cashback received", amount: "+₹150", time: "Nov 18 · Wallet credit" },
    { title: "Refund from boAt", amount: "+₹1,299", time: "Nov 16 · Wallet credit" },
  ];

  return (
    <SectionCard
      label="Transactions"
      title="Recent Transactions"
      description="Every debit and credit from the past week."
    >
      <div className="list-plain">
        {transactions.map((txn) => (
          <div key={txn.title} className="list-row">
            <div>
              <p className="list-title">{txn.title}</p>
              <p className="list-subtitle">{txn.time}</p>
            </div>
            <span className={`amount ${txn.amount.startsWith("-") ? "amount-negative" : "amount-positive"}`}>
              {txn.amount}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default TransactionsSection;