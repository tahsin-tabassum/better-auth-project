export default function CategoryLoading(){
    return (
        <main className="min-h-[70vh] bg-[#F0F6F1] px-4 pb-20 pt-8">
<div className="mx-auto max-w-285 animate-pulse">
<div className="h-23.75 rounded-2xl bg-white"/>

        <div className="mt-6 h-16.25 rounded-2xl bg-white" />
        <div className="my-5 h-4 w-44 rounded bg-[#DFE8DF]" />

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
{Array.from ({length:6}).map((_, index)=>(
<div key={index} className="h-37.5 rounded-xl bg-white" />
))}
</div>
</div>
        </main>
    );
}