'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SupaSelectType } from '@/lib/supabase'
import { supaclient } from '@/lib/supabase-client'
import { useMeeting } from '@videosdk.live/react-sdk'
import { Pause, Play } from 'lucide-react'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Media({
	externalPlayer,
	setExternalVideo,
}: {
	externalPlayer: MutableRefObject<HTMLVideoElement>
	setExternalVideo: Dispatch<
		SetStateAction<{
			link: null
			playing: boolean
		}>
	>
}) {
	const { meetingId, startVideo, stopVideo } = useMeeting({
		onVideoStateChanged: ({ link, status }: { link: string; status: string }) => {
			switch (status) {
				case 'started':
					setExternalVideo({ link, playing: true })
					break
				case 'stopped':
					externalPlayer.current.src = null
					setExternalVideo({ link: null, playing: false })
			}
		},
	})
	const [streamMedia, setStreamMedia] = useState<{ id: string; name: string }[] | undefined>()
	const [selectedMedia, setSelectedMedia] = useState<number | null>(null)

	useEffect(() => {
		const getStreamMedias = async () => {
			const { data: stream } = await supaclient().from('streams').select().eq('meeting_id', meetingId).single()
			if (!stream) return toast.error('There was an error getting media for the stream')

			const { data: medias } = await supaclient()
				.storage.from('stream_media')
				.list(undefined, { search: `${stream.id}` })
			setStreamMedia(medias!)
		}

		getStreamMedias()
	}, [meetingId])

	async function handleStartVideo(path: string) {
		const {
			data: { publicUrl },
		} = await supaclient().storage.from('stream_media').getPublicUrl(path)
		startVideo({ link: publicUrl })
	}

	async function handleStopVideo() {
		stopVideo()
	}

	return (
		<Card className='w-[400px] flex-shrink-0'>
			<CardHeader>
				<CardTitle>Media</CardTitle>
				<CardDescription>{streamMedia?.length || 0} items in the media library</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div>{}</div>
				{streamMedia?.map((media, i) => (
					<div key={media.id} className='flex items-center space-x-1'>
						<div className='flex-grow truncate'>{media.name}</div>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => {
								setSelectedMedia(i)
								if (selectedMedia === i) handleStopVideo()
								else handleStartVideo(media.name)
							}}>
							{selectedMedia === i ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
