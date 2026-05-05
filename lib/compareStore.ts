export interface CompareCarItem {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  image: string;
  price: number;
}

const STORAGE_KEY = 'compare_cars';
export const MAX_COMPARE = 3;
export const COMPARE_EVENT = 'compareUpdate';

export function getCompareCars(): CompareCarItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToCompare(car: CompareCarItem): boolean {
  const cars = getCompareCars();
  if (cars.length >= MAX_COMPARE) return false;
  if (cars.some((c) => String(c.id) === String(car.id))) return true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cars, car]));
  window.dispatchEvent(new Event(COMPARE_EVENT));
  return true;
}

export function removeFromCompare(id: string | number): void {
  const updated = getCompareCars().filter((c) => String(c.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(COMPARE_EVENT));
}

export function isInCompare(id: string | number): boolean {
  return getCompareCars().some((c) => String(c.id) === String(id));
}

export function toggleCompare(car: CompareCarItem): boolean {
  if (isInCompare(car.id)) {
    removeFromCompare(car.id);
    return false;
  }
  return addToCompare(car);
}

export function clearCompare(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(COMPARE_EVENT));
}
