import React from 'react'
import styles from "@/styles/Shadow.module.css"

export default function Shadow({children, width, height, hover}:{children:any, width:number, height:number, hover:boolean}) {
   
    return (
        <div className={hover ? `${styles.shadow_wrapper} ${styles.hover}` : styles.shadow_wrapper}>
            {children}
            <div 
                style={{
                    width: `${width}%`, 
                    height: `${height}%`,
                    top: `${100 - height}%`,  
                    opacity: hover ? '0' : '1', 
                    transition: hover ? 'opacity 0.3s' : ''
                }} 
                className={styles.shadow}
            >
            </div>
        </div>
    )
}
