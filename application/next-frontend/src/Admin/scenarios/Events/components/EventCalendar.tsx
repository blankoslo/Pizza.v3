import { useState } from 'react'

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
                            return (
                                <td
                                    className="h-16 w-16 border border-gray-300 text-center align-top"
                                    key={dayOfWeek}
                                    onClick={() => onClickDay(day ?? 0)}
                                >
                                    {day}
                                </td>
                            )
                        }
                        return <td className="h-16 w-16 border border-gray-300" key={dayOfWeek} />
                    })}
            </tr>
        )
    }

    const onClickDay = (day: number) => {
        alert(`You clicked on ${day}. Also check out ${currentDate}!`)
    }

    return (
        <div>
            <button onClick={() => setPreviousMonth()}>Previous</button>
            <span>{months[currentDate.getMonth()]}</span>
            <button onClick={() => setNextMonth()}>Next</button>
            <div className="mx-auto flex w-[80%] justify-center border border-dashed border-[#05793C]" />
            <table>
                <thead>
                    <tr>
                        {weekdays.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{renderMonth()}</tbody>
            </table>
        </div>
    )
}

export { EventCalendar }
