import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useMeeting } from '@videosdk.live/react-sdk'

export default function Participants() {
	const { participants } = useMeeting()

	return (
		<Card className='w-[400px] h-[20%] flex flex-col flex-shrink-0'>
			<CardHeader>
				<CardTitle>Participants</CardTitle>
				<CardDescription>There are {participants.size - 1} people watching the stream</CardDescription>
			</CardHeader>
			<CardContent className='overflow-scroll'>
				{[...participants.values()]
					.filter((p) => p.mode === 'CONFERENCE')
					.map((p) => (
						<p key={p.id}>{p.displayName} (Host)</p>
					))}
				{[...participants.values()]
					.filter((p) => p.mode !== 'CONFERENCE')
					.map((p) => (
						<p key={p.id}>{p.displayName}</p>
					))}
			</CardContent>
		</Card>
	)
}
