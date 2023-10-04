import { useState } from 'react'
import Image from 'next/image'
import Triangle from 'Admin/assets/Triangle.svg'
import Line from 'Admin/assets/Line.svg'

// Goes into the next month - 1 day, which is the last day of current month, and returns this day
// e.g. if we are in October, and our last day is 31st, we return 31
const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

// Default is monday 1 ... saturday 6, sunday 0
// Changed here so that its monday 0 .. saturday 5, sunday 6
const firstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1
    return firstDay === -1 ? 6 : firstDay
}

const EventCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
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

    const setPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const setNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const renderMonth = () => {
        // Reverse the list so that we can pop instead of shift when rendering rows
        const remainingDays = [...daysInCurrentMonth.reverse()]
        const monthRows = []
        const start = firstDayOfMonth(currentDate)
        monthRows.push(renderRow(remainingDays, start, 6))

        while (remainingDays.length) {
            monthRows.push(renderRow(remainingDays, 0, Math.min(6, remainingDays.length - 1)))
        }
        return monthRows
    }

    const renderRow = (remainingDays: number[], startIndex: number, endIndex: number) => {
        return (
            <tr>
                {Array(7)
                    .fill(null)
                    .map((_, dayOfWeek) => {
                        if (startIndex <= dayOfWeek && dayOfWeek <= endIndex) {
                            const day = remainingDays.pop()
                            const selectedDate = new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                day ? day + 1 : day,
                            )
                            return (
                                <td
                                    className={`h-[40px] w-[43px] border border-[#05793C] text-center align-top text-[#303030] ${
                                        selectedDate > today ? 'cursor-pointer bg-white' : 'opacity-50'
                                    }`}
                                    key={dayOfWeek}
                                    onClick={selectedDate > today ? () => onClickDay(day ?? 0) : () => ''}
                                >
                                    {day}
                                </td>
                            )
                        }
                        return <td className="h-[40px] w-[43px] border border-[#05793C]" key={dayOfWeek} />
                    })}
            </tr>
        )
    }

    const onClickDay = (day: number) => {
        alert(`You clicked on ${new Date(currentDate.getFullYear(), currentDate.getMonth(), day)}!`)
    }

    return (
        <div className="inline-block bg-[#EDFFF6] p-8 text-[#05793C]">
            <div className="flex justify-center">
                <Image
                    onClick={() => setPreviousMonth()}
                    width={15}
                    src={Triangle}
                    className="rotate-180 cursor-pointer"
                    alt="show previous month"
                />
                <span className="mx-3 font-queensCTM text-4xl">{months[currentDate.getMonth()]}</span>
                <Image
                    onClick={() => setNextMonth()}
                    width={15}
                    src={Triangle}
                    alt="show next month"
                    className="cursor-pointer"
                />
            </div>
            <Image
                src={Line}
                className="mx-auto mb-10 mt-4"
                width={440}
                alt="line separating calendar and month display"
            />
            {/* <div className="mx-auto flex  mt-5 mb-14 justify-center border border-dashed border-[#05793C]" /> */}
            <table className="mx-auto italic">
                <thead>
                    <tr>
                        {weekdays.map((day) => (
                            <th className="font-workSans text-xl font-black text-[#05793C]" key={day}>
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
