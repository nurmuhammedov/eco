export const dailyLoginsData = [
  { day: '1', logins: 45 },
  { day: '4', logins: 80 },
  { day: '5', logins: 65 },
  { day: '11', logins: 92 },
  { day: '12', logins: 75 },
  { day: '15', logins: 85 },
  { day: '21', logins: 100 },
  { day: '25', logins: 110 },
  { day: '28', logins: 95 },
  { day: '30', logins: 88 },
]

export const topEmployees = [
  { name: 'Razzaqov Avazbek', logins: 24 },
  { name: 'Hasanov Nodir', logins: 21 },
  { name: 'Sotvoliyev Mirzo', logins: 19 },
  { name: 'Xolmatova Sarvinoz', logins: 17 },
  { name: 'Tursunova Nodira', logins: 11 },
  { name: "Jo'rayev Bekzod", logins: 19 },
  { name: 'Bakirov Jahongir', logins: 14 },
  { name: 'Tursunova Kamola', logins: 13 },
]

export const leastActiveEmployees = [
  { name: 'Nazarov Behruz', sessions: 5, totalSessions: 15 },
  { name: 'Karimova Nilufar', sessions: 7, totalSessions: 15 },
  { name: 'Tursunova Kamola', sessions: 8, totalSessions: 15 },
  { name: 'Ergasheva Feruza', sessions: 9, totalSessions: 15 },
  { name: 'Xalmatova Sarvinoz', sessions: 11, totalSessions: 15 },
]

export const inactiveEmployees = [
  { name: 'Nazarov Behruz', position: 'Bosh mutaxassis' },
  { name: 'Sotvoliyev Mirzo', position: 'Inspektor' },
  { name: 'Ergasheva Feruza', position: 'Yordamchi' },
  { name: 'Xalmatova Sarvinoz', position: 'Inspektor' },
]

export const devicesData = [
  { name: 'Windows PC', value: 45, fill: '#0ea5e9' },
  { name: 'iPhone', value: 17, fill: '#6366f1' },
  { name: 'Android', value: 15, fill: '#10b981' },
  { name: 'MacBook', value: 10, fill: '#f59e0b' },
  { name: 'Tablet', value: 8, fill: '#8b5cf6' },
  { name: 'Qolganlari', value: 5, fill: '#e2e8f0' },
]

export const browsersData = [
  { name: 'Chrome', value: 65, fill: '#3b82f6' },
  { name: 'Safari', value: 20, fill: '#14b8a6' },
  { name: 'Yandex', value: 10, fill: '#f59e0b' },
  { name: 'Boshqa', value: 5, fill: '#e2e8f0' },
]

export const activityPeakData = [
  { time: '08:00', value: 5 },
  { time: '10:00', value: 15 },
  { time: '12:00', value: 22 },
  { time: '14:00', value: 18 },
  { time: '16:00', value: 21 },
  { time: '18:00', value: 10 },
  { time: '20:00', value: 4 },
  { time: '22:00', value: 2 },
]

export const heatmapData = [
  { name: 'Nazarov', hours: [0, 0, 1, 3, 4, 4, 3, 2] },
  { name: 'Sotvaly', hours: [0, 1, 2, 4, 4, 4, 2, 1] },
  { name: 'Xolmati', hours: [0, 0, 0, 4, 3, 4, 3, 0] },
  { name: 'Ergashe', hours: [0, 1, 3, 2, 4, 3, 1, 0] },
  { name: "Po'latv", hours: [0, 0, 1, 4, 4, 4, 2, 0] },
]

export const securityLogs = [
  {
    type: 'alert',
    name: 'Sotvoliyev Mirzo',
    ip: '46.182.76.187',
    location: 'Niderlandiya',
    time: '03:49 AM',
    reason: 'Shubhali IP manzil',
  },
  {
    type: 'warning',
    name: 'Xolmatova Sarvinoz',
    device: 'Yangi qurilma (iPhone 14)',
    time: '21:43 PM',
    reason: 'Yangi qurilma orqali kirish',
  },
  {
    type: 'info',
    name: 'Hasanov Nodir',
    device: "IP manzil o'zgargan",
    time: '18:25 PM',
    reason: "Ketma-ket IP o'zgarishi",
  },
]

export const regionalActivityData = [
  { region: 'Toshkent sh.', active: 647, percent: 76 },
  { region: 'Samarqand', active: 278, percent: 64 },
  { region: "Farg'ona", active: 216, percent: 54 },
  { region: 'Buxoro', active: 108, percent: 33 },
  { region: 'Xorazm', active: 63, percent: 52 },
]
