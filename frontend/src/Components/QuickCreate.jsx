import { Button } from "flowbite-react";
import { useState } from "react";
import { MdAccountBalanceWallet } from "react-icons/md";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import AccountCard from "../Components/AccountCard";
import ExpenseCard from "../Components/ExpenseCard";
import IncomeCard from "../Components/IncomeCard";
import AddGoalCard from "../Components/AddGoalCard";
import { useStore } from "../lib/utils";

export default function QuickCreate({ refreshFn }) {
  const [isExpenseCardVisible, setIsExpenseCardVisible] = useState(false);
  const [isIncomeCardVisible, setIsIncomeCardVisible] = useState(false);
  const [isAccountCardVisible, setIsAccountCardVisible] = useState(false);

  const updateDash = useStore((state) => state.updateDash);

  const toggleExpenseCard = () => {
    setIsExpenseCardVisible(!isExpenseCardVisible);
  };

  const toggleIncomeCard = () => {
    setIsIncomeCardVisible(!isIncomeCardVisible);
  };

  const toggleAccountCard = () => {
    setIsAccountCardVisible(!isAccountCardVisible);
  };

  if (!refreshFn) {
    refreshFn = updateDash;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      <Button.Group>
        <Button onClick={toggleExpenseCard} color="failure">
          <GiPayMoney className="w-4 h-4 mr-3" />
          Add Expense
        </Button>
        <Button onClick={toggleIncomeCard} color="success">
          <GiReceiveMoney className="w-4 h-4 mr-3" />
          Add Income
        </Button>
        <Button onClick={toggleAccountCard} color="blue">
          <MdAccountBalanceWallet className="w-4 h-4 mr-3" />
          Add Account
        </Button>
      </Button.Group>
      {isExpenseCardVisible && (
        <ExpenseCard
          refreshFn={refreshFn}
          toggleExpenseCard={toggleExpenseCard}
        />
      )}
      {isIncomeCardVisible && (
        <IncomeCard refreshFn={refreshFn} toggleIncomeCard={toggleIncomeCard} />
      )}
      {isAccountCardVisible && (
        <AccountCard
          refreshFn={refreshFn}
          toggleAccountCard={toggleAccountCard}
        />
      )}
    </div>
  );
}
