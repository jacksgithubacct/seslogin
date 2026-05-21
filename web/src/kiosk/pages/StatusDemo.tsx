import StatusCurrentDisplay from "../components/StatusCurrentDisplay";

const now = Date.now() / 1000;
const h = (hours: number) => now - hours * 3600;

const MOCK_PERIODS = [
  {
    id: "1",
    startTime: h(1),
    person: { id: "1", firstName: "Alice", lastName: "Anderson" },
  },
  {
    id: "2",
    startTime: h(2),
    person: { id: "2", firstName: "Bob", lastName: "Baker" },
  },
  {
    id: "3",
    startTime: h(3),
    person: { id: "3", firstName: "Carol", lastName: "Clark" },
  },
  {
    id: "4",
    startTime: h(4),
    person: { id: "4", firstName: "David", lastName: "Davis" },
  },
  {
    id: "5",
    startTime: h(5),
    person: { id: "5", firstName: "Eve", lastName: "Evans" },
  },
  {
    id: "6",
    startTime: h(6),
    person: { id: "6", firstName: "Frank", lastName: "Foster" },
  },
  {
    id: "7",
    startTime: h(7),
    person: { id: "7", firstName: "Grace", lastName: "Green" },
  },
  {
    id: "8",
    startTime: h(7.5),
    person: { id: "8", firstName: "Henry", lastName: "Harris" },
  },
  {
    id: "9",
    startTime: h(8.5),
    person: { id: "9", firstName: "Isla", lastName: "Irving" },
  },
  {
    id: "10",
    startTime: h(9),
    person: { id: "10", firstName: "Jack", lastName: "Jones" },
  },
  {
    id: "11",
    startTime: h(9.5),
    person: { id: "11", firstName: "Karen", lastName: "King" },
  },
  {
    id: "12",
    startTime: h(10),
    person: { id: "12", firstName: "Liam", lastName: "Lewis" },
  },
  {
    id: "13",
    startTime: h(10.5),
    person: { id: "13", firstName: "Mia", lastName: "Martin" },
  },
  {
    id: "14",
    startTime: h(11),
    person: { id: "14", firstName: "Nathan", lastName: "Nelson" },
  },
  {
    id: "15",
    startTime: h(11.5),
    person: { id: "15", firstName: "Olivia", lastName: "Owen" },
  },
  {
    id: "16",
    startTime: h(12.5),
    person: { id: "16", firstName: "Peter", lastName: "Parker" },
  },
  {
    id: "17",
    startTime: h(13),
    person: { id: "17", firstName: "Quinn", lastName: "Quinn" },
  },
  {
    id: "18",
    startTime: h(13.5),
    person: { id: "18", firstName: "Rachel", lastName: "Roberts" },
  },
  {
    id: "19",
    startTime: h(14),
    person: { id: "19", firstName: "Sam", lastName: "Scott" },
  },
  {
    id: "20",
    startTime: h(14.5),
    person: { id: "20", firstName: "Tara", lastName: "Taylor" },
  },
  {
    id: "21",
    startTime: h(15),
    person: { id: "21", firstName: "Uma", lastName: "Underwood" },
  },
  {
    id: "22",
    startTime: h(2.5),
    person: { id: "22", firstName: "Victor", lastName: "Vance" },
  },
  {
    id: "23",
    startTime: h(3.5),
    person: { id: "23", firstName: "Wendy", lastName: "Walker" },
  },
  {
    id: "24",
    startTime: h(5.5),
    person: { id: "24", firstName: "Xander", lastName: "Xavier" },
  },
  {
    id: "25",
    startTime: h(6.5),
    person: { id: "25", firstName: "Yasmine", lastName: "Young" },
  },
  {
    id: "26",
    startTime: h(8),
    person: { id: "26", firstName: "Zoe", lastName: "Zhang" },
  },
  {
    id: "27",
    startTime: h(9.2),
    person: { id: "27", firstName: "Aaron", lastName: "Abbott" },
  },
  {
    id: "28",
    startTime: h(11.8),
    person: { id: "28", firstName: "Bella", lastName: "Brooks" },
  },
  {
    id: "29",
    startTime: h(12.2),
    person: { id: "29", firstName: "Carlos", lastName: "Cruz" },
  },
  {
    id: "30",
    startTime: h(16),
    person: { id: "30", firstName: "Diana", lastName: "Dixon" },
  },
];

export default function StatusDemo() {
  return <StatusCurrentDisplay periods={MOCK_PERIODS} />;
}
