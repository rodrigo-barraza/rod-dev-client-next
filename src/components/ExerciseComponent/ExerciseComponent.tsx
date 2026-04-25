import React from 'react'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import ExerciseCollection from '@/collections/ExerciseCollection4'

export default function ExerciseComponent(props: any) {
    const { entry, ghost } = props

    function figureExercisePart(exercise: string) {
        let part = ''
        ExerciseCollection.forEach((entry: any) => {
            if (entry.name === exercise) {
            part = entry.type
            }
        })
        return part
    }

    return (
        <div>
            { entry &&
                <div className={`ExerciseComponent ${ghost ? 'ghost' : ''}`}>
                    <div className="header">
                        <div>
                            <div className="title">{entry.exercise}</div>
                            <div>{UtilityLibrary.uppercase(figureExercisePart(entry.exercise))}</div>
                        </div>
                        <div>
                            <div>{UtilityLibrary.buildExerciseSubtitle(entry)}</div>
                        </div>
                        <div>
                            <div>{UtilityLibrary.toHumanDateAndTime(entry.date)}</div>
                        </div>
                        <div>
                            <div>Total Volume: {UtilityLibrary.calculateTotalVolume(entry.sets)} lbs</div>
                            <div>Average Weight: {UtilityLibrary.calculateAverageWeight(entry.sets)} lbs</div>
                        </div>
                        <div>
                            <div>Total Reps: {UtilityLibrary.calculateTotalReps(entry.sets)}</div>
                            <div>Average Rep: {UtilityLibrary.calculateAverageReps(entry.sets)}</div>
                        </div>
                    </div>
                    <div className="body">
                    {entry.sets?.map((set: any, index: any) => (
                        <div key={index}>
                            <div>Set {index+1}</div>
                            <div>{UtilityLibrary.toTime(set.date)}</div>
                            <div>{set.reps} reps</div>
                            <div>{set.weight} {set.unit}</div>
                            <div>---</div>
                            <div>{UtilityLibrary.calculateSetVolume(set.reps, set.weight)} lbs</div>
                            <div>{UtilityLibrary.calculateSetVolumeRatio(set, entry.sets)}%</div>
                        </div>
                    ))}
                    </div>
                </div>
            }
        </div>
    )
}
