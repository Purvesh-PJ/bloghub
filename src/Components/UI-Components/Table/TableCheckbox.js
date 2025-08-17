import { forwardRef, useEffect, useRef } from 'react';

export const Checkbox = forwardRef(({ intermediate, ...rest }, ref) => {
    
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
        resolvedRef.current.intermediate = intermediate
    },[resolvedRef, intermediate])

    return (
        <>
            <input type='checkbox' ref={resolvedRef} {...ref}/>
        </>
    )
})