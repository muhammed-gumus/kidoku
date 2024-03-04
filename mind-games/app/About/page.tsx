import Link from "next/link";

const teamMembers = [
  {
    id: 1,
    name: "Name Surname",
    title: "CEO",
    photo: "/images/user.png",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    twitter: "https://twitter.com",
    linkedin: "https://www.linkedin.com/in/muhammedgums",
    mail: "mailto:mail@gmail.com",
  },
  {
    id: 2,
    name: "Name Surname",
    title: "Software Engineer",
    photo: "/images/user.png",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    twitter: "https://twitter.com",
    linkedin: "https://www.linkedin.com",
    mail: "mailto:mail@umd.edu",
  },
  {
    id: 3,
    name: "Name Surname",
    title: "CTO",
    photo: "/images/user.png",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    twitter: "https://twitter.com",
    linkedin: "https://www.linkedin.com",
    mail: "mailto:mail@gmail.com",
  },
  {
    id: 4,
    name: "Name Surname",
    title: "Software Engineer",
    photo: "/images/user.png",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    twitter: "https://twitter.com",
    linkedin: "https://www.linkedin.com",
    mail: "mailto:mail@gmail.com",
  },
  // Add more team members as needed
];

export default function Home() {
  var desc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  return (
    <div className="flex min-h-screen flex-col items-center ">
      <div className="flex flex-col md:flex-row sm:gap-4 justify-around items-center px-4 md:px-24 mt-12">
        <img
          className="w-full md:w-1/3 rounded-full object-cover"
          src="/images/about-banner.png"
        />
        <div className="flex flex-col w-full md:w-1/2 gap-4 sm:text-center md:text-left sm-items-center sm:justify-center">
          <p className="text-7xl font-bold">Kidoku Akademi</p>
          <p className="text-md opacity-70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </p>
          <Link href={"#our-team"}>
            <button className="mt-4 w-full md:w-1/3 flex flex-row items-center sm:justify-center gap-4 text-black px-10 py-3 rounded-lg text-xl bg-white transition duration-300 hover:text-indigo-600 hover:bg-white mb-6 md:mb-0">
              Our Team
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.75735 5.63605L6.34314 7.05026L12 12.7071L17.6569 7.05029L16.2427 5.63608L12 9.87872L7.75735 5.63605Z"
                  fill="currentColor"
                />
                <path
                  d="M6.34314 12.7071L7.75735 11.2929L12 15.5356L16.2427 11.2929L17.6569 12.7071L12 18.364L6.34314 12.7071Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full mt-24 sm:mt-12 flex flex-col items-center sm:justify-center sm:text-center">
        <p className="text-7xl sm:text-5xl font-bold flex justify-center text-white w-full py-2">
          Who We Are?
        </p>
        <p className="mt-8 sm:text-sm sm:px-4 md:px-16 w-full text-center tracking-wider opacity-90 leading-6">
          {desc}
        </p>
        <div className="w-full md:flex flex-row tracking-wider text-4xl sm:hidden bg-white font-extrabold items-center justify-evenly mt-16 py-6 text-black ">
          <div className="flex items-center justify-center gap-2">
            28.632 Mutlu Müşteri{" "}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z"
                fill="currentColor"
              />
              <path
                d="M6.34314 12.7071L7.75735 11.2929L12 15.5356L16.2427 11.2929L17.6569 12.7071L12 18.364L6.34314 12.7071Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2">
            5 Ülke
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.4388 7L14.8387 4H7V10H14.8387L12.4388 7ZM19 12H7V22H5V2H19L15 7L19 12Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2">
            28 Ürün
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2.5C5.44772 2.5 5 2.94772 5 3.5V5.5C5 6.05228 5.44772 6.5 6 6.5C6.55228 6.5 7 6.05228 7 5.5V3.5C7 2.94772 6.55228 2.5 6 2.5Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 21.5C15.973 21.5 18.441 19.3377 18.917 16.5H19C21.2091 16.5 23 14.7091 23 12.5C23 10.2909 21.2091 8.5 19 8.5V7.5H1V15.5C1 18.8137 3.68629 21.5 7 21.5H13ZM3 9.5V15.5C3 17.7091 4.79086 19.5 7 19.5H13C15.2091 19.5 17 17.7091 17 15.5V9.5H3ZM21 12.5C21 13.6046 20.1046 14.5 19 14.5V10.5C20.1046 10.5 21 11.3954 21 12.5Z"
                fill="currentColor"
              />
              <path
                d="M9 3.5C9 2.94772 9.44771 2.5 10 2.5C10.5523 2.5 11 2.94772 11 3.5V5.5C11 6.05228 10.5523 6.5 10 6.5C9.44771 6.5 9 6.05228 9 5.5V3.5Z"
                fill="currentColor"
              />
              <path
                d="M14 2.5C13.4477 2.5 13 2.94772 13 3.5V5.5C13 6.05228 13.4477 6.5 14 6.5C14.5523 6.5 15 6.05228 15 5.5V3.5C15 2.94772 14.5523 2.5 14 2.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
      <div id="our-team" className="w-full mt-12 flex flex-col items-center">
        <p className="text-7xl sm:text-5xl font-bold flex justify-center text-white w-full py-2">
          Our Team
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full items-start justify-center gap-4 px-4 md:px-8 mt-12 mb-32">
          {/* Team cards */}
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white w-full text-black px-4 py-4 flex justify-center items-center flex-col rounded-lg hover:scale-105"
            >
              <img
                className="rounded-full object-cover py-2 px-2 w-2/3 "
                src={member.photo}
              />
              <p className="text-2xl font-bold mb-2">{member.name}</p>
              <p className="text-l italic mb-2">{member.title}</p>
              <p className="text-md opacity-70 text-center line-clamp-5 hover:line-clamp-none transition delay-150 duration-300 hover:delay-300">
                {member.desc}
              </p>
              <div className="flex justify-center">
                <div className="flex flex-row gap-4 mt-2">
                  <Link href={member.twitter}></Link>
                  <Link href={member.linkedin}></Link>
                  <Link href={member.mail}></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
