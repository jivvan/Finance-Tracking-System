import React, { useState } from "react";
import { Card } from "flowbite-react";

const FinanceCalendar = () => {
  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - 3);

  const generateCalendarData = () => {
    const data = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      data.push({
        date: new Date(currentDate),
        income: Math.floor(Math.random() * 1000), // Mock income data
        expense: Math.floor(Math.random() * 1000), // Mock expense data
        balance: Math.floor(Math.random() * 1000), // Mock balance data
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  const calendarData = generateCalendarData();

  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  const getDayName = (day) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[day];
  };

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === "prev") {
      newMonth -= 1;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
    } else if (direction === "next") {
      newMonth += 1;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderCalendar = () => {
    const monthData = calendarData.filter(
      (entry) =>
        entry.date.getMonth() === currentMonth &&
        entry.date.getFullYear() === currentYear
    );

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border rounded"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const entry = monthData.find((e) => e.date.getDate() === i);
      days.push(
        <div key={i} className="p-2 border rounded">
          <div className="text-sm">
            {i}
            <span className="ml-4 text-xs text-gray-500">
              {getDayName(new Date(currentYear, currentMonth, i).getDay())}
            </span>
          </div>
          <div className="text-xs text-gray-500"></div>
          {entry ? (
            <>
              <div className="text-xs text-green-500">
                Income: ${entry.income}
              </div>
              <div className="text-xs text-red-500">
                Expense: ${entry.expense}
              </div>
              <div className="text-xs text-blue-500">
                Balance: ${entry.balance}
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500">No data</div>
          )}
        </div>
      );
    }

    return <div className="grid grid-cols-5 gap-2 md:grid-cols-7">{days}</div>;
  };

  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Your Calendar</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange("prev")}
          className="text-blue-500"
        >
          Previous
        </button>
        <span>
          {getMonthName(currentMonth)} {currentYear}
        </span>
        <button
          onClick={() => handleMonthChange("next")}
          className="text-blue-500"
        >
          Next
        </button>
      </div>
      <div className="hidden grid-cols-7 gap-2 mb-2 md:grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-center text-gray-500">
            {day}
          </div>
        ))}
      </div>
      {renderCalendar()}
      <p className="font-light text-md">
        <span className="text-green-500">Income</span> |{" "}
        <span className="text-red-500">Expense</span> |{" "}
        <span className="text-blue-500">Balance</span>
        <br />
        <span className="text-xs">*Only past 90 days data is considered</span>
      </p>
    </Card>
  );
};

export default FinanceCalendar;
