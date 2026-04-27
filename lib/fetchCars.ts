import { query } from '@/lib/db';

export interface CarSSR {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  status?: string;
  photo_count: number;
}

export interface PaginationSSR {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FetchCarsOptions {
  page?: number;
  limit?: number;
  brand?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
}

export async function fetchCarsSSR(options: FetchCarsOptions = {}): Promise<{
  cars: CarSSR[];
  pagination: PaginationSSR;
}> {
  const { page = 1, limit = 12, brand = '', q = '', minPrice, maxPrice } = options;
  const offset = (page - 1) * limit;

  let whereSql = 'WHERE (status = ? OR status IS NULL)';
  const whereParams: any[] = ['available'];

  if (brand && brand !== 'ทั้งหมด') {
    whereSql += ' AND LOWER(brand) = ?';
    whereParams.push(brand.toLowerCase());
  }

  if (minPrice) {
    const min = parseInt(minPrice);
    if (!isNaN(min)) {
      whereSql += ' AND price >= ?';
      whereParams.push(min);
    }
  }

  if (maxPrice) {
    const max = parseInt(maxPrice);
    if (!isNaN(max)) {
      whereSql += ' AND price <= ?';
      whereParams.push(max);
    }
  }

  if (q.trim() && !brand) {
    const searchLower = q.trim().toLowerCase();
    const containsTerm = `%${searchLower}%`;
    whereSql += ` AND (
      LOWER(brand) = ? OR
      LOWER(brand) LIKE ? OR
      LOWER(model) LIKE ? OR
      LOWER(CONCAT(brand, ' ', model)) LIKE ?
    )`;
    whereParams.push(searchLower, `${searchLower}%`, containsTerm, containsTerm);
  }

  let orderSql = ' ORDER BY created_at DESC';
  const mainParams = [...whereParams];

  if (q.trim() && !brand) {
    const searchLower = q.trim().toLowerCase();
    const containsTerm = `%${searchLower}%`;
    orderSql = ` ORDER BY
      CASE
        WHEN LOWER(brand) = ? THEN 1
        WHEN LOWER(brand) LIKE ? THEN 2
        WHEN LOWER(model) LIKE ? THEN 3
        WHEN LOWER(CONCAT(brand, ' ', model)) LIKE ? THEN 4
        ELSE 5
      END,
      created_at DESC`;
    mainParams.push(searchLower, `${searchLower}%`, containsTerm, containsTerm);
  }

  mainParams.push(limit, offset);

  const [countResult, carsResult] = await Promise.all([
    query(`SELECT COUNT(*) as total FROM cars ${whereSql}`, whereParams),
    query(
      `SELECT id, brand, model, year, price, image, image2, image3, image4, image5, status FROM cars ${whereSql}${orderSql} LIMIT ? OFFSET ?`,
      mainParams
    ),
  ]);

  const total =
    Array.isArray(countResult) && countResult.length > 0
      ? (countResult[0] as any).total
      : 0;

  const carsArray = Array.isArray(carsResult) ? carsResult : [];

  const cars: CarSSR[] = carsArray.map((car: any) => {
    let photoCount = 0;
    if (car.image?.trim()) photoCount++;
    if (car.image2?.trim()) photoCount++;
    if (car.image3?.trim()) photoCount++;
    if (car.image4?.trim()) photoCount++;
    if (car.image5?.trim()) photoCount++;
    return { ...car, photo_count: photoCount };
  });

  return {
    cars,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function fetchBrandsSSR(): Promise<string[]> {
  const result = await query(
    `SELECT DISTINCT brand FROM cars WHERE (status = ? OR status IS NULL) AND brand IS NOT NULL AND brand != '' ORDER BY brand ASC`,
    ['available']
  );
  return Array.isArray(result) ? result.map((r: any) => r.brand).filter(Boolean) : [];
}
