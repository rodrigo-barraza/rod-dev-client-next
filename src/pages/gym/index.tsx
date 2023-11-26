import React from 'react'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import GymApiLibrary from '@/libraries/GymApiLibrary'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import InputComponent from '@/components/InputComponent/InputComponent'
import style from './index.module.scss'
import ExerciseCollection from '@/collections/ExerciseCollection4'
import DialogComponent from '@/components/DialogComponent'
import moment from 'moment'

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req, query, res, resolvedUrl } = context

  let returnBody = {
      props: {
          meta: {},
          guest: {}
      }
  }

  // returnBody.props.meta = {
  //     url: `https://rod.dev${resolvedUrl}`,
  //     title: 'Text to Image - Your Likes',
  //     description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
  //     keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
  //     type: 'website',
  //     image: 'https://renders.rod.dev/f377bd59-49d6-4858-91df-3c0a6456c5e2.jpg',
  // }

  return returnBody
}

export default function Gym(props) {
    const router = useRouter()
    const { meta, guest } = props
    const [gymExercises, setGymExercises] = useState(ExerciseCollection)
    const [isHidden, setIsHidden] = useState({})
    const [trackList, setTrackList] = useState([])
    const [weight, setWeight] = useState('')
    const [reps, setReps] = useState('')

    const [selectedExercise, setSelectedExercise] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedEquipment, setSelectedEquipment] = useState('')
    const [selectedPosition, setSelectedPosition] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('')
    const [selectedStance, setSelectedStance] = useState('')
    const [selectedForm, setSelectedForm] = useState('')

    const [journal, setJournal] = useState([{}])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [exerciseStep, setExerciseStep] = useState('exercises')
    const [subtitle, setSubtitle] = useState('')

    async function getJournal() {
        const { data, error, response } = await GymApiLibrary.getJournal()
        if (data) {
            const superExercises = {}
            data.slice(0, 1000).forEach((set, key) => {
            // const setDate = new Date(set.date)
            // const currentDate = new Date()
            // const differenceInTime = currentDate - setDate
            // const differenceInDays = differenceInTime / (1000 * 3600 * 24)

            const setDate = moment(set.date)
            const currentDate = moment()
            const differenceInDays = currentDate.diff(setDate, 'days')
            
            const dateKey = setDate.toString().slice(0, 15)
            const exerciseKey = `${set.exercise}`

            if (!superExercises[dateKey]) {
                superExercises[dateKey] = {}
            } 
            if (superExercises[dateKey]) {
                if (!superExercises[dateKey][exerciseKey]) {
                    superExercises[dateKey][exerciseKey] = {}
                    superExercises[dateKey][exerciseKey].sets = []
                    superExercises[dateKey][exerciseKey].date = set.date
                    superExercises[dateKey][exerciseKey].exercise = set.exercise
                    superExercises[dateKey][exerciseKey].part = 'x' // get part off another list
                    superExercises[dateKey][exerciseKey].position = set.position
                    superExercises[dateKey][exerciseKey].stance = set.stance
                    superExercises[dateKey][exerciseKey].style = set.style
                    superExercises[dateKey][exerciseKey].form = set.form
                    superExercises[dateKey][exerciseKey].equipment = set.equipment
                    // calculate days since last exercise to x amount of days
                    superExercises[dateKey][exerciseKey].daysSinceLastExercise = differenceInDays 
                }
                superExercises[dateKey][exerciseKey].sets.unshift(set)
            }
            })
            setJournal(superExercises)
        }
    }

    function toggleIsVisible(key: number) {
        let newIsVisible = {...isHidden}
        newIsVisible[key] = !newIsVisible[key]
        setIsHidden(newIsVisible)
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

    function calculateSetVolumeRatio(set, sets) {
        let totalVolume = calculateTotalVolume(sets)
        let setVolume = calculateSetVolume(set.weight, set.reps)
        return ((setVolume / totalVolume)*100).toFixed(0)
    }

    function returnRoutines() {
        let routines = []
        gymExercises.forEach((entry: any) => {
            if (!routines.includes(entry.type)) {
            routines.push(entry.type)
            }
        })
        return routines
    }

    function openTrackModal(type) {
        setIsModalOpen(true)
        setSelectedType(type)
        let trackList = []
        gymExercises.forEach((entry: any) => {
            if (entry.type === type) {
            trackList.push(entry)
            }
        })
        setTrackList(trackList)
    }

    function clearSelectedExercise() {
        setSelectedExercise('')
        setSelectedPosition('')
        setSelectedEquipment('')
        setSelectedStyle('')
        setSelectedStance('')
        setSelectedForm('')
    }

    function closeTrackModal() {
        setTrackList([])
        clearSelectedExercise()
        setIsModalOpen(false)
    }

    async function logSet() {
        await GymApiLibrary.postJournal(selectedExercise.name, reps, weight, 'lbs', selectedStyle, selectedStance, selectedEquipment, selectedPosition)
        await getJournal()
        setReps('')
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
    function daySinceLastExercise(workout) {
        let days = '(...)'
        let lowestExercise = null
        Object.values(journal).forEach((exercises) => {
            Object.values(exercises).forEach((exercise) => {
                if (exercise.exercise == workout.name) {
                    if (lowestExercise === null || exercise.daysSinceLastExercise < lowestExercise.daysSinceLastExercise) {
                      lowestExercise = exercise
                      days = `(${exercise?.daysSinceLastExercise})`
                    }
                }
            })
        })
        return days
    }

    useEffect(() => {
        if (!selectedExercise) {
            setExerciseStep('exercises')
        } else if (selectedExercise && selectedExercise.form?.length && !selectedForm) {
            setExerciseStep('forms')
        } else if (selectedExercise && selectedExercise.style?.length && !selectedStyle) {
            setExerciseStep('styles')
        } else if (selectedExercise && selectedExercise.stance?.length && !selectedStance) {
            setExerciseStep('stances')
        } else if (selectedExercise && selectedExercise.position?.length && !selectedPosition) {
            setExerciseStep('positions')
        } else if (selectedExercise && selectedExercise.equipment.length && !selectedEquipment) {
            setExerciseStep('equipment')
        } else if (selectedExercise && selectedPosition && selectedEquipment) {
            setExerciseStep('log')
        }

        setSubtitle(individualSubtitle(selectedExercise))

        const newQuery = { ...router.query }
        // set query parameters
        if (selectedExercise) {
            newQuery.exercise = selectedExercise.name
        }
        if (selectedStance) {
            newQuery.stance = selectedStance
        }
        if (selectedStyle) {
            newQuery.style = selectedStyle
        }
        if (selectedPosition) {
            newQuery.position = selectedPosition
        }
        if (selectedEquipment) {
            newQuery.equipment = selectedEquipment
        }
        if (selectedForm) {
            newQuery.form = selectedForm
        }
        
        const queryString = new URLSearchParams(newQuery).toString()
        window.history.replaceState(
            { url: `${router.pathname}?${queryString}`, as: `${router.asPath}?${queryString}`, options: { shallow: true } },
            '',
            `${router.pathname}?${queryString}`
        )
        if (!selectedEquipment && !selectedPosition && !selectedStance && !selectedStyle && !selectedForm && !selectedExercise) {
            window.history.replaceState({}, '', router.pathname)
        }
    }, [selectedExercise, selectedPosition, selectedEquipment, selectedStyle, selectedStance, selectedForm])

    useEffect(() => {
        getJournal()
    }, [])

    useEffect(() => {
        if (router.query.exercise) {
            const selectedExercise = gymExercises.find((exercise) => exercise.name === router.query.exercise)
            if (selectedExercise) {
                setIsModalOpen(selectedExercise.type)
                setSelectedExercise(selectedExercise)
                if (router.query.stance) {
                    setSelectedStance(router.query.stance)
                }
                if (router.query.style) {
                    setSelectedStyle(router.query.style)
                }
                if (router.query.position) {
                    setSelectedPosition(router.query.position)
                }
                if (router.query.equipment) {
                    setSelectedEquipment(router.query.equipment)
                }
                if (router.query.form) {
                    setSelectedForm(router.query.form)
                }
            }
        }
    }, [])

    return (
    <main className={style.GymPage}>
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
            <meta property="og:url" content={meta.url}/>
            <meta property="og:type" content={meta.type}/>
            <meta property="og:site_name" content="Rodrigo Barraza"/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            <meta property="og:image" content={meta.image} />
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={meta.title}/>
            <meta name="twitter:site" content="@rawdreygo"/>
            <meta name="twitter:url" content={meta.url}/>
            <meta name="twitter:image" content={meta.image}/>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <div className="container">
        <DialogComponent show={isModalOpen}>
        { exerciseStep === 'exercises' && (
            <>
                <header>
                    <h2>{UtilityLibrary.capitalize(selectedType)} Exercises</h2>
                </header>
                <div>
                { trackList?.map((exercise, index) => (
                    <ButtonComponent 
                    key={index}
                    className="new neutral"
                    label={`${daySinceLastExercise(exercise)} ${exercise.name}`}
                    type="button" 
                    onClick={() => setSelectedExercise(exercise)}
                    ></ButtonComponent>
                ))}
                </div>
                <footer>
                    <ButtonComponent 
                    className="mini negative"
                    label="Cancel"
                    type="button" 
                    onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { exerciseStep === 'forms' && (
            <>
                <header>
                    <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Form</h2>
                </header>
                <div>
                { selectedExercise?.form?.map((form, index) => (
                    <ButtonComponent 
                        key={index}
                        className="new neutral"
                        label={form}
                        type="button" 
                        onClick={() => setSelectedForm(form)}
                    ></ButtonComponent>
                ))}
                </div>
                <footer>
                    <ButtonComponent 
                        className="mini"
                        label="Back"
                        type="button" 
                        onClick={(() => {
                            clearSelectedExercise()
                        })}
                    ></ButtonComponent>
                    <ButtonComponent 
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { exerciseStep === 'styles' && (
            <>
                <header>
                    <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Style</h2>
                </header>
                <div>
                { selectedExercise?.style?.map((style, index) => (
                    <ButtonComponent 
                        key={index}
                        className="new neutral"
                        label={style}
                        type="button" 
                        onClick={() => setSelectedStyle(style)}
                    ></ButtonComponent>
                ))}
                </div>
                <footer>
                    <ButtonComponent 
                        className="mini"
                        label="Back"
                        type="button" 
                        onClick={(() => {
                            clearSelectedExercise()
                        })}
                    ></ButtonComponent>
                    <ButtonComponent 
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { exerciseStep === 'stances' && (
            <>
                <header>
                    <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Stance</h2>
                </header>
                <div>
                { selectedExercise?.stance?.map((stance, index) => (
                    <ButtonComponent 
                        key={index}
                        className="new neutral"
                        label={stance}
                        type="button" 
                        onClick={() => setSelectedStance(stance)}
                    ></ButtonComponent>
                ))}
                </div>
                <footer>
                    <ButtonComponent 
                        className="mini"
                        label="Back"
                        type="button" 
                        onClick={(() => {
                            clearSelectedExercise()
                        })}
                    ></ButtonComponent>
                    <ButtonComponent 
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { exerciseStep === 'positions' && (
            <>
                <header>
                    <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Position</h2>
                </header>
                <div>
                { selectedExercise?.position?.map((position, index) => (
                    <ButtonComponent 
                        key={index}
                        className="new neutral"
                        label={position}
                        type="button" 
                        onClick={() => setSelectedPosition(position)}
                    ></ButtonComponent>
                ))}
                </div>
                <footer>
                    <ButtonComponent 
                        className="mini"
                        label="Back"
                        type="button" 
                        onClick={(() => {
                            clearSelectedExercise()
                        })}
                    ></ButtonComponent>
                    <ButtonComponent 
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { exerciseStep === 'equipment' && (
            <>
                <header>
                    <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Equipment</h2>
                </header>
                <div>
                { selectedExercise?.equipment?.map((gear, index) => (
                    <ButtonComponent 
                        key={index}
                        className="new neutral"
                        label={gear}
                        type="button" 
                        onClick={() => setSelectedEquipment(gear)}
                    ></ButtonComponent>
                ))}
                </div>
                <footer>
                    <ButtonComponent 
                        className="mini"
                        label="Back"
                        type="button" 
                        onClick={(() => {
                            clearSelectedExercise()
                        })}
                    ></ButtonComponent>
                    <ButtonComponent 
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { exerciseStep === 'log' && (
            <>
                <form className={style.logForm}>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Entry</h2>
                    </header>
                    <div className={style.blocks}>
                        { selectedForm && ( <div>{selectedForm}</div> ) }
                        { selectedStyle && ( <div>{selectedStyle}</div> ) }
                        { selectedStance && ( <div>{selectedStance}</div> ) }
                        { selectedPosition && ( <div>{selectedPosition}</div> ) }
                        { selectedEquipment && ( <div>{selectedEquipment}</div> ) }
                    </div>
                    <div>
                        <InputComponent 
                            label="Weight"
                            type="text"
                            value={weight} 
                            onChange={setWeight}
                        ></InputComponent>
                        <InputComponent 
                            label="Reps"
                            type="text"
                            value={reps} 
                            onChange={setReps}
                        ></InputComponent>
                    </div>
                    <footer>
                        <ButtonComponent 
                            className="mini negative"
                            label="Finish Sets"
                            type="button" 
                            onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                        <ButtonComponent 
                            className="mini positive"
                            label="Log Set"
                            type="button" 
                            onClick={() => logSet()}
                        ></ButtonComponent>
                    </footer>
                </form>
                <div className="GymList">
                    {Object.keys(journal)?.map((days, daysIndex) => (
                        <div key={daysIndex}>
                        { !daysIndex && (
                        <ul>
                            {Object.keys(journal[days])?.map((entry, entryIndex) => (
                                <li key={entryIndex} className={`${UtilityLibrary.isToday(journal[days][entry].date) ? "today" : ""}`}>
                                    { !entryIndex && journal[days][entry].exercise == selectedExercise.name && (
                                        <>
                                        <div className="header" onClick={() => toggleIsVisible(entryIndex)}>
                                            <div>
                                            <div className="title">{journal[days][entry].exercise}</div>
                                            <div>{figureExercisePart(journal[days][entry].exercise)}</div>
                                            </div>
                                            <div>
                                            <div>{UtilityLibrary.toHumanDateAndTime(journal[days][entry].date)}</div>
                                            </div>
                                            <div>
                                            <div>day {journal[days][entry].day}</div>
                                            </div>
                                            <div>
                                            <div>total volume: {calculateTotalVolume(journal[days][entry].sets)} lbs</div>
                                            <div>average weight: {calculateAverageWeight(journal[days][entry].sets)} lbs</div>
                                            </div>
                                        </div>
                                        { !isHidden[entryIndex] && (
                                            <div className="body">
                                            {journal[days][entry].sets?.map((set, index) => (
                                                <div key={index}>
                                                <div>Set: {index+1}</div>
                                                <div>{UtilityLibrary.toTime(set.date)}</div>
                                                <div>{set.reps} reps</div>
                                                <div>{set.weight} {set.unit}</div>
                                                <div>---</div>
                                                <div>{calculateSetVolume(set.reps, set.weight)} lbs</div>
                                                <div>{calculateSetVolumeRatio(set, journal[days][entry].sets)}%</div>
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        )}
                        </div>
                    ))}
                </div>
            </>
        )}
        </DialogComponent>
        <div className="CardComponent">
            <h1>Track:</h1>
                <div className="routines">
                { returnRoutines().map((type, routineIndex) => (
                    <ButtonComponent 
                    key={routineIndex}
                    className="mini blue"
                    label={UtilityLibrary.uppercase(type)}
                    type="button" 
                    onClick={() => openTrackModal(type)}
                    ></ButtonComponent>
                ))}
                </div>
            <h1>Log:</h1>
            <div className="GymList">
                {Object.keys(journal)?.map((days, daysIndex) => (
                    <div key={daysIndex}>
                    <h2>{days}</h2>
                    <ul>
                        {Object.keys(journal[days])?.map((entry, entryIndex) => (
                            <li key={entryIndex} className={`${UtilityLibrary.isToday(journal[days][entry].date) ? "today" : ""}`}>
                                <div className="header" onClick={() => toggleIsVisible(entryIndex)}>
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
                                        <div>Total: {calculateTotalVolume(journal[days][entry].sets)} lbs</div>
                                        <div>Average: {calculateAverageWeight(journal[days][entry].sets)} lbs</div>
                                    </div>
                                </div>
                                { !isHidden[entryIndex] && (
                                    <div className="body">
                                    {journal[days][entry].sets?.map((set, index) => (
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
                                )}
                            </li>
                        ))}
                    </ul>
                    </div>
                ))}
            </div>
        </div>
        </div>
    </main>
    )
}
