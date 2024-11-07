import { Button } from "flowbite-react";
import { useState } from "react";
import { MdAccountBalanceWallet } from "react-icons/md";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import AccountCard from "../Components/AccountCard";
import ExpenseCard from "../Components/ExpenseCard";
import IncomeCard from "../Components/IncomeCard";

export default function QuickCreate() {
  const [isExpenseCardVisible, setIsExpenseCardVisible] = useState(false);
  const [isIncomeCardVisible, setIsIncomeCardVisible] = useState(false);
  const [isAccountCardVisible, setIsAccountCardVisible] = useState(false);

  const toggleExpenseCard = () => {
    setIsExpenseCardVisible(!isExpenseCardVisible);
  };

  const toggleIncomeCard = () => {
    setIsIncomeCardVisible(!isIncomeCardVisible);
  };

  const toggleAccountCard = () => {
    setIsAccountCardVisible(!isAccountCardVisible);
  };
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      <Button.Group>
        <Button
          onClick={toggleExpenseCard}
          className="bg-red-500 border border-red-500 rounded-r-none hover:bg-transparent hover:text-red-500"
        >
          <GiPayMoney className="w-4 h-4 mr-3" />
          Add Expense
        </Button>
        <Button
          onClick={toggleIncomeCard}
          className="bg-green-500 border border-green-500 hover:bg-transparent hover:text-green-500"
        >
          <GiReceiveMoney className="w-4 h-4 mr-3" />
          Add Income
        </Button>
        <Button
          onClick={toggleAccountCard}
          className="bg-blue-500 border border-blue-500 rounded-l-none hover:bg-transparent hover:text-blue-500"
        >
          <MdAccountBalanceWallet className="w-4 h-4 mr-3" />
          Add Account
        </Button>
      </Button.Group>
      {isExpenseCardVisible && (
        <ExpenseCard toggleExpenseCard={toggleExpenseCard} />
      )}
      {isIncomeCardVisible && (
        <IncomeCard toggleIncomeCard={toggleIncomeCard} />
      )}
      {isAccountCardVisible && (
        <AccountCard toggleAccountCard={toggleAccountCard} />
      )}
    </div>
  );
}
