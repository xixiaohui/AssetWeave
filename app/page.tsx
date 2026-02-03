
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
        <p className='text-8xl text-white tracking-tighter text-balance bg-blue-800 p-3'>Asset Weave</p>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          
           <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="/assets"
            target="_blank"
            rel="noopener noreferrer"
          >
            资产详情 + 购买
          </a>

          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            （持仓）
          </a>
          
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/yields"
            target="_blank"
            rel="noopener noreferrer"
          >
            分红
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/issuer"
            target="_blank"
            rel="noopener noreferrer"
          >
            发行
          </a>
        </div>
      </main>
    </div>
  );
}
