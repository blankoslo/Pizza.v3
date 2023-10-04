import { useState } from 'react'
import Image from 'next/image'
import Triangle from 'Admin/assets/Triangle.svg'
import Line from 'Admin/assets/Line.svg'
import PizzaEaten from 'Admin/assets/pizza/PizzaEaten.svg'
import PizzaRound from 'Admin/assets/pizza/PizzaRound.svg'
import PizzaSlice from 'Admin/assets/pizza/PizzaSlice.svg'

// Goes into the next month - 1 day, which is the last day of current month, and returns this day
// e.g. if we are in October, and our last day is 31st, we return 31
const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

// Default is monday 1 ... saturday 6, sunday 0
// This changes to monday 0 .. saturday 5, sunday 6
const firstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1
    return firstDay === -1 ? 6 : firstDay
}

const EventCalendar = () => {
    // This will always be the first of the month, but is used for Year + Month purposes
    const [currentDate, setCurrentDate] = useState(new Date())
    const pizzaImages = [PizzaEaten, PizzaRound, PizzaSlice]
    const daysInCurrentMonth = Array(daysInMonth(currentDate))
        .fill(null)
        .map((_, i) => i + 1)
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const today = new Date()

    const chosen = [8, 13, 27] // remove

    const renderMonth = () => {
        // Reverse the list so that we can pop instead of shift when rendering rows
        const remainingDays = [...daysInCurrentMonth.reverse()]
        const weekRow = []
        const start = firstDayOfMonth(currentDate)
        weekRow.push(renderRow(remainingDays, start, 6))

        while (remainingDays.length > 0) {
            weekRow.push(renderRow(remainingDays, 0, Math.min(6, remainingDays.length - 1)))
        }
        return weekRow
    }

    const renderRow = (remainingDays: number[], startIndex: number, endIndex: number) => {
        return (
            <tr className="text-center align-top font-extralight">
                {Array(7)
                    .fill(null)
                    .map((_, dayOfWeek) => {
                        if (startIndex <= dayOfWeek && dayOfWeek <= endIndex) {
                            const day = remainingDays.pop()
                            if (day) {
                                // currentToday is at 00:00, so therefore comparisons with today will always yield LT
                                const currentToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                                const currentTomorrow = new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    day + 1,
                                )
                                console.log(currentToday, today)
                                return (
                                    <td
                                        className={`h-[3.75rem] w-[4.15rem] border border-[#05793C] text-[#303030]
                                        ${
                                            today >= currentTomorrow
                                                ? 'opacity-50'
                                                : chosen.includes(day)
                                                ? 'cursor-pointer bg-[#05793C] text-white hover:bg-[#FF9494]'
                                                : 'cursor-pointer bg-white hover:bg-[#5FE09D]'
                                        }`}
                                        key={dayOfWeek}
                                        onClick={() => onClickDay(currentToday)}
                                    >
                                        {day}
                                        {chosen.includes(day) && (
                                            <Image
                                                className="mx-auto"
                                                src={pizzaImages[Math.floor(Math.random() * pizzaImages.length)]}
                                                width={43}
                                                alt="pizza"
                                            />
                                        )}
                                    </td>
                                )
                            }
                        }
                        return <td className="h-[3.75rem] w-[4.15rem] border border-[#05793C]" key={dayOfWeek} />
                    })}
            </tr>
        )
    }

    // This will later be changed to open a modal to add/delete event
    const onClickDay = (selectedDate: Date) => {
        if (selectedDate < today) return
        alert(`You clicked on ${selectedDate}!`)
    }

    const setPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const setNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    return (
        <div className="inline-block bg-[#EDFFF6] px-6 pb-6 pt-3 text-[#05793C]">
            <div className="flex justify-center">
                <Image
                    onClick={() => setPreviousMonth()}
                    width={20}
                    src={Triangle}
                    className="rotate-180 cursor-pointer"
                    alt="show previous month"
                />
                <span className="mx-4 font-queensCTM text-4xl">{months[currentDate.getMonth()]}</span>
                <Image
                    onClick={() => setNextMonth()}
                    width={20}
                    src={Triangle}
                    alt="show next month"
                    className="cursor-pointer"
                />
            </div>
            <Image
                src={Line}
                className="mx-auto mb-9 mt-3"
                width={440}
                alt="line separating calendar and month display"
            />
            <table className="mx-auto italic">
                <thead>
                    <tr>
                        {weekdays.map((day) => (
                            <th className="font-workSans text-xl" key={day}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{renderMonth()}</tbody>
            </table>
        </div>
    )
}

export { EventCalendar }
