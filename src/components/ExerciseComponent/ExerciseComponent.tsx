import React from 'react'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import ExerciseCollection from '@/collections/ExerciseCollection'

export default function ExerciseComponent(props: any) {
    const { journal, days, entry } = props

    function individualSubtitle(entry: any) {
        if (entry) {
            let subtitle = ''
            if (entry.form) {
                subtitle = subtitle ? `${subtitle}, ${entry.form}` : `${entry.form} `
            }
            if (entry.style) {
                subtitle = subtitle ? `${subtitle}, ${entry.style}` : `${entry.style} `
            }
            if (entry.stance) {
                subtitle = subtitle ? `${subtitle}, ${entry.stance}` : `${entry.stance} `
            }
            if (entry.position) {
                subtitle = subtitle ? `${subtitle}, ${entry.position}` : `${entry.position} `
            }
            if (entry.equipment) {
                subtitle = subtitle ? `${subtitle}, ${entry.equipment}` : `${entry.equipment} `
            }
            return subtitle
        }
    }

    function figureExercisePart(exercise: string) {
        let part = ''
        ExerciseCollection.forEach((entry: any) => {
            if (entry.name === exercise) {
            part = entry.type
            }
        })
        return part
    }

    function calculateSetVolume(weight: string, volume: string) {
        return Number(weight) * Number(volume)
    }

    function calculateTotalVolume(sets: object[]) {
        if (sets && sets.length) {
            let totalVolume = 0
            sets.forEach((set: any) => {
            totalVolume += calculateSetVolume(set.weight, set.reps)
            })
            return totalVolume
        }
    }

    function calculateAverageWeight(sets: object[]) {
        if (sets && sets.length) {
            let totalWeight = 0
            sets.forEach((set: any) => {
            totalWeight += Number(set.weight)
            })
            return (totalWeight / sets.length).toFixed(1)
        }
    }
    
    function calculateAverageReps(sets: object[]) {
        if (sets && sets.length) {
            let totalReps = 0
            sets.forEach((set: any) => {
                totalReps += Number(set.reps)
            })
            return (totalReps / sets.length).toFixed(1)
        }
    }

    function calculateTotalReps(sets: object[]) {
        if (sets && sets.length) {
            let totalReps = 0
            sets.forEach((set: any) => {
                totalReps += Number(set.reps)
            })
            return totalReps
        }
    }

    function calculateSetVolumeRatio(set, sets) {
        let totalVolume = calculateTotalVolume(sets)
        let setVolume = calculateSetVolume(set.weight, set.reps)
        return ((setVolume / totalVolume)*100).toFixed(0)
    }

    return (
        <div>
            { journal && days && entry &&
                <>
                    <div className="header">
                        <div>
                            <div className="title">{journal[days][entry].exercise}</div>
                            <div>{UtilityLibrary.uppercase(figureExercisePart(journal[days][entry].exercise))}</div>
                        </div>
                        <div>
                            <div>{individualSubtitle(journal[days][entry])}</div>
                        </div>
                        <div>
                            <div>{UtilityLibrary.toHumanDateAndTime(journal[days][entry].date)}</div>
                        </div>
                        <div>
                            <div>Total Volume: {calculateTotalVolume(journal[days][entry].sets)} lbs</div>
                            <div>Average Weight: {calculateAverageWeight(journal[days][entry].sets)} lbs</div>
                        </div>
                        <div>
                            <div>Total Reps: {calculateTotalReps(journal[days][entry].sets)}</div>
                            <div>Average Rep: {calculateAverageReps(journal[days][entry].sets)}</div>
                        </div>
                    </div>
                    <div className="body">
                    {journal[days][entry].sets?.map((set: any, index: any) => (
                        <div key={index}>
                            <div>Set {index+1}</div>
                            <div>{UtilityLibrary.toTime(set.date)}</div>
                            <div>{set.reps} reps</div>
                            <div>{set.weight} {set.unit}</div>
                            <div>---</div>
                            <div>{calculateSetVolume(set.reps, set.weight)} lbs</div>
                            <div>{calculateSetVolumeRatio(set, journal[days][entry].sets)}%</div>
                        </div>
                    ))}
                    </div>
                </>
            }
        </div>
    )
}
