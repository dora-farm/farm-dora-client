/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#1CA673", // 주요 색상(초록) (사용예시: className="bg-green")
        },
        brown: {
          DEFAULT: "#490401", // 주요 색상(판매자 쪽 짙은 갈색) (사용예시: className="bg-brown")
          light: "#FEFAE0", // 옅은 갈색 (사용예시: className="bg-brown-light")
        },
        gray: {
          DEFAULT: "#F2F2F2", // 주요 색상(회색 배경) (사용예시: className="bg-gray")
          dark: "#8A8A8A", // 회색 테두리 (사용예시: className="border-gray-dark")
          light: "#FBFBFB" // 밝은 회색 배경 (사용예시: className="bg-gray-light")
        },
        danger: "#D92B2B",  // 빨강색 (사용예시: className="bg-danger text-white" - 판매종료 or 탈퇴버튼 등)
        warning: "#F29B30", // 주황색 (사용예시: className="text-warning" - 품절 메시지 등)
        text: {
          gray: "#8A8A8A", // 회색 텍스트 (사용예시: className="text-text-gray")
        }
      }
    },
  },
  plugins: [],
}