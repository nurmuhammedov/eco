export type CreateUpdateDistrictDto = {
  id?: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
  region: {
    id: number;
    name: string;
  };
};
