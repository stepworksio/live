import MainNav from '@/components/main-nav'
import { UserNav } from '@/components/user-nav'
import { supaserver, verifyAuth } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Meeting from './components/meeting'

export default async function StreamPage({ params: { streamId } }: { params: { streamId: string } }) {
	const user = await verifyAuth()
	const token = process.env.VIDEOSDK_AUTH_TOKEN!
	console.log(token)

	const { data: stream, error } = await supaserver(cookies).from('streams').select().eq('id', streamId).single()
	if (error || !stream) notFound()

	return (
		<div className='flex flex-col min-h-screen space-y-6'>
			<header className='sticky top-0 z-40 border-b bg-background'>
				<div className='container flex items-center justify-between h-16 py-4'>
					<MainNav title={stream.name} />
					<UserNav user={user} />
				</div>
			</header>
			<div className='grid flex-1 gap-12'>
				<main className='flex flex-col flex-1 w-full overflow-hidden'>
					<Meeting stream={stream} token={token} user={user} />
				</main>
			</div>
		</div>
	)
}