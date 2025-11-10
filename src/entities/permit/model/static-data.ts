import { Permit, PermitDocumentType } from './types';

export const staticPermits: Permit[] = [
  {
    id: 1,
    organizationStir: '123456789',
    organizationName: '"Kamalak" MCHJ',
    documentType: PermitDocumentType.PERMIT,
    documentName: 'A Sinfi ruxsatnomasi',
    registrationNumber: 'RA-12345',
    registrationDate: '2024-10-20',
  },
  {
    id: 2,
    organizationStir: '987654321',
    organizationName: '"Toshkent Invest" AJ',
    documentType: PermitDocumentType.LICENSE,
    documentName: 'Bank faoliyati litsenziyasi',
    registrationNumber: 'LI-98765',
    registrationDate: '2023-05-15',
  },
  {
    id: 3,
    organizationStir: '111222333',
    organizationName: '"Eco Qurilish" XK',
    documentType: PermitDocumentType.CONCLUSION,
    documentName: 'Ekologik xulosa',
    registrationNumber: 'XU-11223',
    registrationDate: '2024-01-30',
  },
  {
    id: 4,
    organizationStir: '444555666',
    organizationName: '"Yangi Davr" MCHJ',
    documentType: PermitDocumentType.PERMIT,
    documentName: 'B Sinfi ruxsatnomasi',
    registrationNumber: 'RA-44556',
    registrationDate: '2022-11-15',
  },
  {
    id: 5,
    organizationStir: '777888999',
    organizationName: '"Eski Havas" AJ',
    documentType: PermitDocumentType.LICENSE,
    documentName: 'Savdo litsenziyasi',
    registrationNumber: 'LI-77889',
    registrationDate: '2019-03-01',
  },
];
