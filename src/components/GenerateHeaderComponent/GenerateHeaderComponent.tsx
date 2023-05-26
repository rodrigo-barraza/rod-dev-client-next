import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ActiveLink from '../ActiveLink'
import styles from './GenerateHeaderComponent.module.scss'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

const GenerateHeaderComponent: React.FC = (props) => {
    const { guest, renders } = props;
    const router = useRouter()
    const [getGuest, setGuest] = useState(guest)
    const [getRenders, setRenders] = useState(renders)

    useEffect(() => {
        setGuest(guest)
    }, [guest])

    useEffect(() => {
        setRenders(renders)
    }, [renders])

    function goToLikes() {
        router.push({
          pathname: '/likes'
        })
    }
    function goToRenders() {
        router.push({
          pathname: '/renders'
        })
    }

    return (
        <div className={styles.GenerateHeaderComponent}>
            <ButtonComponent 
                className="secondary mini filled black"
                label={`Liked Renders (${guest.likes ? guest.likes : '0'})`}
                type="button" 
                onClick={goToLikes}
                disabled={!getGuest?.likes}
              ></ButtonComponent>
            <ButtonComponent 
              className="secondary mini filled black"
              label={`My ${getRenders.length > 1 ? 'Renders' : 'Render'} (${getRenders.length ? getRenders.length : '0'})`}
              type="button" 
              onClick={goToRenders}
              disabled={!getRenders.length}
            ></ButtonComponent>
        </div>
    )
}

export default GenerateHeaderComponent