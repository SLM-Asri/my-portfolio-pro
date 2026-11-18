import { useEffect } from 'react';
import { observePageMotion } from '../utils/scrollReveal.js';

export function usePageMotion(rootRef, pathname) {
    useEffect(() => observePageMotion(rootRef.current), [pathname, rootRef]);
}
