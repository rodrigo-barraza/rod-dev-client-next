import { useRouter } from 'next/router'
import styles from './GenerateHeaderComponent.module.scss'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'

const GenerateHeaderComponent: React.FC = (props) => {
    const { guest, renders } = props;
    const router = useRouter()

    return (
        <div className={styles.GenerateHeaderComponent}>
          <div className={styles.container}>
            <ButtonComponent 
              className="transparent-night"
              label="Generate"
              icon="add_photo_alternate"
              type="button" 
              disabled={!guest?.likes}
              routeHref="generate"
            ></ButtonComponent>
            {/* <ButtonComponent 
              className="transparent-night"
              label="Explore"
              icon="search"
              type="button" 
              routeHref="explore"
              disabled={!guest?.likes}
            ></ButtonComponent> */}
            <ButtonComponent 
              className="transparent-night"
              icon="favorite"
              label={`Liked (${guest?.likes ? guest.likes : '0'})`}
              type="button" 
              routeHref="likes"
              disabled={!guest?.likes}
            ></ButtonComponent>
            <ButtonComponent 
              className="transparent-night"
              icon="photo_library"
              label={`Images (${renders?.length ? renders.length : '0'})`}
              type="button" 
              routeHref="renders"
              disabled={!renders?.length}
            ></ButtonComponent>
          </div>
        </div>
    )
}

export default GenerateHeaderComponent