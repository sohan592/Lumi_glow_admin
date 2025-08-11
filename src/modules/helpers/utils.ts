//filtered Entries
export const filteredEntries = (data: any) => {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) =>
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== 'undefined',
    ),
  );
  return filteredData;
};

//generate query string;
export const generateQueryString = (data: any) => {
  const filteredData = filteredEntries(data);

  const buildQueryString = (obj: any, prefix = ''): string => {
    return Object.keys(obj)
      .map((key) => {
        const value = obj[key];
        const prefixedKey = prefix ? `${prefix}[${key}]` : key;

        if (
          value != null &&
          value !== 'undefined' &&
          value !== undefined &&
          value !== ''
        ) {
          if (Array.isArray(value)) {
            return value
              .map((item) => `${prefixedKey}[]=${encodeURIComponent(item)}`)
              .join('&');
          } else if (typeof value === 'object') {
            return buildQueryString(value, prefixedKey);
          } else {
            return `${prefixedKey}=${encodeURIComponent(value)}`;
          }
        }
      })
      .filter(Boolean)
      .join('&');
  };

  const queryString = buildQueryString(filteredData);
  const fullQueryString = `?${queryString}`;

  return fullQueryString;
};

//generate nested query string

export const generateNestedQueryString = (
  params: Record<string, any>,
): string => {
  const queryString: string[] = [];

  const isValidValue = (value: any): boolean =>
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !Number.isNaN(value) &&
    !(Array.isArray(value) && value.length === 0) &&
    !(typeof value === 'object' && Object.keys(value).length === 0);

  const parseObject = (key: string, value: any) => {
    if (isValidValue(value)) {
      if (typeof value === 'object') {
        queryString.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`,
        );
      } else {
        queryString.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        );
      }
    }
  };

  Object.entries(params).forEach(([key, value]) => parseObject(key, value));

  return queryString.join('&');
};

//get random number
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//get random string
export const getRandomString = (length: number) => {
  const randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );
  }
  return result;
};

//get status number
export const getStatusNumber = (status: string | null) => {
  if (status === 'Active') {
    return 1;
  }
  if (status === 'Draft') {
    return 4;
  }
  if (status === 'Deleted') {
    return 3;
  }
  if (status === 'Inactive') {
    return 2;
  }
  return undefined;
};

//get sort order

export const getSortOrder = (sortOrder: string | null) => {
  if (sortOrder === 'A-Z') {
    return 'ASC';
  }
  if (sortOrder === 'Z-A') {
    return 'DESC';
  }
  if (sortOrder === 'id') {
    return 'ASC';
  }
  return 'DESC';
};

//get sort by
export const getSortBy = (sortOrder: string | null) => {
  if (sortOrder === 'A-Z') {
    return 'name';
  }
  if (sortOrder === 'Z-A') {
    return 'name';
  }
  return sortOrder;
};
export const getSortByCoupon = (sortOrder: string | null) => {
  if (sortOrder === 'A-Z') {
    return 'campaignName';
  }
  if (sortOrder === 'Z-A') {
    return 'campaignName';
  }
  return sortOrder;
};
export const getSortByOrder = (sortOrder: string | null) => {
  if (sortOrder === 'A-Z') {
    return 'customerName';
  }
  if (sortOrder === 'Z-A') {
    return 'customerName';
  }
  return sortOrder;
};
