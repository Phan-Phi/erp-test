import { Grid, Box, Skeleton as MuiSkeleton } from "@mui/material";

const Skeleton = () => {
	return (
		<Box>
			<Grid container spacing={3}>
				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={12}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={8}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={4}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={12}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={12}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={6}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={8}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={4}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>

				<Grid item xs={12}>
					<MuiSkeleton variant="rectangular" height="1.5rem" />
				</Grid>
			</Grid>
		</Box>
	);
};

export default Skeleton;
