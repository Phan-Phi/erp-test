import { forwardRef, useRef, useEffect } from "react";

import { MenuItem, Checkbox, ListItemText } from "@mui/material";

export const IndeterminateCheckbox = forwardRef(({ indeterminate, hasText = false, ...rest }, ref) => {
	const defaultRef = useRef();
	const resolvedRef = ref || defaultRef;

	useEffect(() => {
		resolvedRef.current.indeterminate = indeterminate;
	}, [resolvedRef, indeterminate]);

	if (hasText) {
		return (
			<MenuItem ref={resolvedRef} {...rest} selected={false}>
				<Checkbox checked={rest.checked} />
				<ListItemText
					primary="Tất cả"
					onClick={(e) => {
						if (resolvedRef.current) {
							resolvedRef.current.querySelector("input").click();
						}
					}}
				/>
			</MenuItem>
		);
	} else {
		return <Checkbox ref={resolvedRef} indeterminate={Boolean(indeterminate)} {...rest} />;
	}
});
