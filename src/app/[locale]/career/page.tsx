import CareerTimeline from "@/components/career-time-line";

export default async function Page({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;

    return (
        <>
            <div className="h-16"/>
            <CareerTimeline locale={locale}/>
            <div className="h-32"/>
        </>
    );
}