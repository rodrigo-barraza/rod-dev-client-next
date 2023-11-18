import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { debounce, filter } from 'lodash'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import GymApiLibrary from '@/libraries/GymApiLibrary'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import InputComponent from '@/components/InputComponent/InputComponent';
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'
import style from './index.module.scss'
import PaginationComponent from '@/components/PaginationComponent/PaginationComponent'
import GalleryComponent from '@/components/GalleryComponent/GalleryComponent'
import FilterComponent from '@/components/FilterComponent/FilterComponent'
import ExerciseCollection from '@/collections/ExerciseCollection3'
import DialogComponent from '@/components/DialogComponent'

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

  return returnBody;
}

export default function Gym(props) {
    const { meta, guest } = props;
    const [gymExercises, setGymExercises] = useState(ExerciseCollection);
    const [isHidden, setIsHidden] = useState({});
    const [trackList, setTrackList] = useState([]);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [journal, setJournal] = useState([{}]);
    const dialogReference: any = useRef({})
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getJournal();
    }, []);


    useEffect(() => {
        console.log(selectedExercise)
        // ExerciseCollection.forEach((entry: any) => {
        //   if (entry.name === selectedExercise) {
        //     // console.log(entry)
        //     setSelectedSuperExercise(entry)
        //   }
        // })
    }, [selectedExercise]);

    // const [activeRoutine, setActiveEntry] = useState({});

    async function getJournal() {
        const { data, error, response } = await GymApiLibrary.getJournal();
        if (data) {
            const exercises = {};
            const superExercises = {};
            // let dateCounter = 100;
            // let pastDate;
            // let isSameDay = true;
            data.slice(0, 333).forEach((set, key) => {
            const exercise = set;
            const objectKey = `${exercise.date.slice(0,10)} ${set.exercise}`;
            if (!exercises[objectKey]) {
                exercises[objectKey] = {}
                exercises[objectKey].sets = []
                // exercises[objectKey].day = dateCounter
                exercises[objectKey].date = set.date
                exercises[objectKey].exercise = set.exercise
                exercises[objectKey].part = 'x' // get part off another list
            }
            exercises[objectKey].sets.unshift(exercise)

            const newDate = new Date(exercise.date);

            const dateKey = newDate.toString().slice(0, 15);
            const exerciseKey = `${set.exercise}`;

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
                }
                superExercises[dateKey][exerciseKey].sets.unshift(exercise)
            }
            });
            console.log('superExercises', superExercises)
            setJournal(superExercises);
            // setJournal(exercises);
        }
    }

    function toggleIsVisible(key: number) {
        let newIsVisible = {...isHidden}
        newIsVisible[key] = !newIsVisible[key]
        setIsHidden(newIsVisible)
    }

    function calculateSetVolume(weight: string, volume: string) {
        return Number(weight) * Number(volume);
    }
    function calculateTotalVolume(sets: object[]) {
        if (sets && sets.length) {
            let totalVolume = 0;
            sets.forEach((set: any) => {
            totalVolume += calculateSetVolume(set.weight, set.reps);
            })
            return totalVolume;
        }
    }

    function calculateAverageWeight(sets: object[]) {
        if (sets && sets.length) {
            let totalWeight = 0;
            sets.forEach((set: any) => {
            totalWeight += Number(set.weight);
            })
            return (totalWeight / sets.length).toFixed(1);
        }
    }

    function calculateSetVolumeRatio(set, sets) {
        let totalVolume = calculateTotalVolume(sets);
        let setVolume = calculateSetVolume(set.weight, set.reps);
        return ((setVolume / totalVolume)*100).toFixed(0);
    }

    function returnRoutines() {
        let routines = [];
        gymExercises.forEach((entry: any) => {
            if (!routines.includes(entry.type)) {
            routines.push(entry.type);
            }
        })
        return routines;
    }

    function openTrackModal(type) {
        setIsModalOpen(true);
        setSelectedType(type)
        let trackList = [];
        gymExercises.forEach((entry: any) => {
            if (entry.type === type) {
            trackList.push(entry);
            }
        })
        setTrackList(trackList);
    }

    function closeTrackModal() {
        setTrackList([]);
        setSelectedExercise('');
        setSelectedPosition('');
        setSelectedEquipment('');
        setIsModalOpen(false);
    }

    async function logSet() {
        await GymApiLibrary.postJournal(selectedExercise.name, reps, weight, 'lbs');
        await getJournal();
        setReps('');
    }

    function figureExercisePart(exercise) {
        let part = '';
        ExerciseCollection.forEach((entry: any) => {
            if (entry.name === exercise) {
            part = entry.type;
            }
        })
        return part;
    }
  

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
        { !selectedExercise && (
            <>
                <header>
                    <h2>{selectedType}</h2>
                </header>
                <div>
                { trackList?.map((exercise, index) => (
                    <ButtonComponent 
                    key={index}
                    className="new neutral"
                    label={exercise.name}
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
        { selectedExercise && selectedExercise.positions.length && !selectedPosition && (
            <>
                <header>
                    <h2>Position</h2>
                </header>
                <div>
                { selectedExercise.positions.map((position, index) => (
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
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { selectedExercise && selectedExercise.equipment.length && selectedPosition && !selectedEquipment && (
            <>
                <header>
                    <h2>Equipment</h2>
                </header>
                <div>
                { selectedExercise.equipment.map((gear, index) => (
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
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                    ></ButtonComponent>
                </footer>
            </>
        )}
        { selectedExercise && selectedPosition && selectedEquipment && (
            <>
                <form className={style.logForm}>
                    <header>
                        <h2>{selectedExercise.name}</h2>
                    </header>
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
                                            <div>-------------</div>
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
                    className="blue"
                    label={type}
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
                                    <div>-------------</div>
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
