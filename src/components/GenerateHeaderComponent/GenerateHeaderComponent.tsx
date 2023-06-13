import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './GenerateHeaderComponent.module.scss'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'

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
          <div className={styles.container}>
            <ButtonComponent 
              className="transparent-night"
              label="Generate"
              icon="add_photo_alternate"
              type="button" 
              disabled={!getGuest?.likes}
              routeHref="generate"
            ></ButtonComponent>
            {/* <ButtonComponent 
              className="transparent-night"
              label="Explore"
              icon="search"
              type="button" 
              routeHref="explore"
              disabled={!getGuest?.likes}
            ></ButtonComponent> */}
            <ButtonComponent 
              className="transparent-night"
              icon="favorite"
              label={`Liked (${guest.likes ? guest.likes : '0'})`}
              type="button" 
              routeHref="likes"
              disabled={!getGuest?.likes}
            ></ButtonComponent>
            <ButtonComponent 
              className="transparent-night"
              icon="photo_library"
              label={`Images (${getRenders.length ? getRenders.length : '0'})`}
              type="button" 
              routeHref="renders"
              disabled={!getRenders.length}
            ></ButtonComponent>
          </div>
        </div>
    )
}

export default GenerateHeaderComponent