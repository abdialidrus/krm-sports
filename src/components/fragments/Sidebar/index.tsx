import { useRouter } from 'next/router'
import styles from './Sidebar.module.scss'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { signOut } from 'next-auth/react'


type Proptypes = {
    menus: Array<{
        title: string,
        url: string,
        icon: string
    }>
}
const Sidebar = (props: Proptypes) => {
    const { menus } = props
    const { pathname } = useRouter();
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar__top}>
                <h1 className={styles.sidebar__top__title}>Admin Panel</h1>
                <div className={styles.sidebar__top__list}>
                    {menus.map((menu, index) => (
                        <Link
                            href={menu.url}
                            key={menu.title}
                            className={`${styles.sidebar__top__list__item} 
                            ${pathname === menu.url && styles.sidebar__top__list__item__active}`}
                        >
                            <i className={`bx ${menu.icon} ${styles.sidebar__top__list__item__icon}`}></i>
                            <h4 className={styles.sidebar__top__list__item__title}>{menu.title}</h4>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles.sidebar__bottom}>
                <Button
                    type='button'
                    variant='secondary'
                    className={styles.sidebar__bottom__button}
                    onClick={() => signOut()}>
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default Sidebar