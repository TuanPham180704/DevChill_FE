export default function DevChillApp() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 rounded-2xl 
        bg-linear-to-br from-blue-50 via-white to-blue-100 
        w-full max-w-4xl shadow-md border border-blue-100"
      >
        <div className="relative w-48 h-95 rounded-[2rem] bg-linear-to-b from-gray-900 to-black shadow-xl p-2">
          <div className="w-full h-full rounded-[1.7rem] bg-white overflow-hidden flex flex-col">
            <div className="h-5 bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">
              18:07
            </div>
            <div className="flex-1 bg-linear-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center p-3">
              <div className="w-16 h-16 rounded-xl bg-blue-600 shadow mb-3 flex items-center justify-center text-white font-semibold text-sm">
                App
              </div>
              <div className="text-sm font-semibold text-gray-800">
                DevChill
              </div>
              <div className="text-[11px] text-gray-500 mt-1 text-center leading-tight">
                Xem phim mọi lúc, mọi nơi
              </div>
            </div>

            <div className="h-3 bg-gray-100" />
          </div>
        </div>
        <div className="text-gray-900 max-w-md text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
            Trải nghiệm <span className="text-blue-600">DevChill</span> mọi lúc,
            mọi nơi
          </h2>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">
            Tải ứng dụng DevChill để xem phim yêu thích ngay trên điện thoại.
            Giao diện nhẹ, mượt, hỗ trợ đồng bộ tiến trình xem giữa các thiết
            bị.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
              text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.6 9.48l1.84-3.18a.5.5 0 10-.87-.5l-1.88 3.26A8.94 8.94 0 0012 8c-1.67 0-3.23.46-4.59 1.26L5.53 5.8a.5.5 0 10-.87.5l1.84 3.18A9 9 0 003 16h18a9 9 0 00-3.4-6.52zM7 14a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              Android
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black 
              text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.365 1.43c0 1.14-.46 2.21-1.22 3.02-.82.87-2.17 1.54-3.32 1.44-.14-1.11.47-2.24 1.2-3.03.82-.89 2.23-1.55 3.34-1.43zM20.4 17.5c-.9 2.1-1.34 3.03-2.5 4.76-1.6 2.43-3.85 2.5-4.47 2.5-.63 0-1.05-.17-1.77-.17-.74 0-1.22.16-1.88.17-.61 0-2.1-.23-3.43-2.02C4.02 20.7 2 16.85 2 12.9c0-4.8 3.12-7.34 6.19-7.34 1.63 0 2.99 1.06 4.02 1.06.98 0 2.5-1.12 4.35-1.12.79 0 3.05.07 4.49 2.15-.12.07-2.67 1.53-2.67 4.55 0 3.6 3.12 4.86 3.02 4.3z" />
              </svg>
              iOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
