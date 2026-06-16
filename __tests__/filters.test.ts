import {
  filterCandidates,
  paginate,
  sortCandidates,
  totalPages,
} from '../src/utils/helpers';
import type { Candidate } from '../src/types/candidate';

function makeCandidate(override: Partial<Candidate> = {}): Candidate {
  return {
    id: 'test',
    name: 'Тест Тестович',
    position: 'react-middle',
    pos_label: 'React — ведущий программист',
    email: 'test@test.com',
    phone: '+7 000 000-00-00',
    city: 'Бишкек',
    tg: '@test',
    exp: [],
    total_exp: '~1 г.',
    stack: 'React, TypeScript',
    edu: 'КНУ, 2020',
    verdict: 'ПОДХОДИТ',
    vc: 'verdict-green',
    criteria: [],
    summary: '',
    questions: [],
    status: 'new',
    createdAt: '2026-01-01T00:00:00Z',
    ...override,
  };
}

const candidates: Candidate[] = [
  makeCandidate({ id: '1', name: 'Иванов Иван', verdict: 'ПОДХОДИТ', vc: 'verdict-green', total_exp: '~3 г.', createdAt: '2026-01-01T00:00:00Z' }),
  makeCandidate({ id: '2', name: 'Петров Пётр', verdict: 'ЧАСТИЧНО', vc: 'verdict-orange', total_exp: '~1 г.', createdAt: '2026-02-01T00:00:00Z' }),
  makeCandidate({ id: '3', name: 'Сидоров Сидор', verdict: 'НЕ ПОДХОДИТ', vc: 'verdict-red', total_exp: '~5 г.', createdAt: '2026-03-01T00:00:00Z' }),
];

describe('filterCandidates', () => {
  describe('фильтрация по вердикту', () => {
    it('возвращает всех кандидатов при вердикте "Все"', () => {
      expect(filterCandidates(candidates, 'Все', '')).toHaveLength(3);
    });

    it('фильтрует по вердикту ПОДХОДИТ', () => {
      const result = filterCandidates(candidates, 'ПОДХОДИТ', '');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('фильтрует по вердикту ЧАСТИЧНО', () => {
      const result = filterCandidates(candidates, 'ЧАСТИЧНО', '');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('фильтрует по вердикту НЕ ПОДХОДИТ', () => {
      const result = filterCandidates(candidates, 'НЕ ПОДХОДИТ', '');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });
  });

  describe('поиск по имени', () => {
    it('находит кандидата по частичному совпадению имени', () => {
      const result = filterCandidates(candidates, 'Все', 'Иванов');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('поиск регистронезависим', () => {
      const result = filterCandidates(candidates, 'Все', 'иванов');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('возвращает пустой массив, если поиск не дал результатов', () => {
      expect(filterCandidates(candidates, 'Все', 'xyz_not_exists')).toHaveLength(0);
    });

    it('возвращает пустой массив для пустого списка кандидатов', () => {
      expect(filterCandidates([], 'Все', 'Иванов')).toHaveLength(0);
    });
  });

  describe('комбинированная фильтрация', () => {
    it('применяет вердикт и поиск одновременно', () => {
      expect(filterCandidates(candidates, 'ПОДХОДИТ', 'Иванов')).toHaveLength(1);
    });

    it('возвращает пустой массив, если вердикт и поиск не совпадают', () => {
      expect(filterCandidates(candidates, 'ПОДХОДИТ', 'Петров')).toHaveLength(0);
    });
  });
});

describe('sortCandidates', () => {
  it('сортирует по имени по возрастанию', () => {
    const sorted = sortCandidates(candidates, 'name', 'asc');
    expect(sorted[0].name).toBe('Иванов Иван');
    expect(sorted[2].name).toBe('Сидоров Сидор');
  });

  it('сортирует по имени по убыванию', () => {
    const sorted = sortCandidates(candidates, 'name', 'desc');
    expect(sorted[0].name).toBe('Сидоров Сидор');
    expect(sorted[2].name).toBe('Иванов Иван');
  });

  it('сортирует по опыту по возрастанию', () => {
    const sorted = sortCandidates(candidates, 'total_exp', 'asc');
    expect(sorted[0].total_exp).toBe('~1 г.');
    expect(sorted[2].total_exp).toBe('~5 г.');
  });

  it('сортирует по опыту по убыванию', () => {
    const sorted = sortCandidates(candidates, 'total_exp', 'desc');
    expect(sorted[0].total_exp).toBe('~5 г.');
    expect(sorted[2].total_exp).toBe('~1 г.');
  });

  it('сортирует по дате добавления', () => {
    const sorted = sortCandidates(candidates, 'createdAt', 'asc');
    expect(sorted[0].id).toBe('1');
    expect(sorted[2].id).toBe('3');
  });

  it('не мутирует исходный массив', () => {
    const originalOrder = candidates.map((c) => c.id);
    sortCandidates(candidates, 'name', 'desc');
    expect(candidates.map((c) => c.id)).toEqual(originalOrder);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it('возвращает первые 10 элементов для первой страницы', () => {
    expect(paginate(items, 1)).toHaveLength(10);
    expect(paginate(items, 1)[0]).toBe(1);
  });

  it('возвращает правильные элементы для второй страницы', () => {
    const page2 = paginate(items, 2);
    expect(page2[0]).toBe(11);
    expect(page2).toHaveLength(10);
  });

  it('возвращает остаток элементов для последней неполной страницы', () => {
    expect(paginate(items, 3)).toHaveLength(5);
  });
});

describe('totalPages', () => {
  it('вычисляет количество страниц', () => {
    expect(totalPages(25)).toBe(3);
    expect(totalPages(10)).toBe(1);
    expect(totalPages(11)).toBe(2);
    expect(totalPages(0)).toBe(0);
  });
});
