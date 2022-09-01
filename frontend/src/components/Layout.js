import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
            <Outlet />
        </Box>
    )
}

export default Layout