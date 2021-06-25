import React from "react";
import tw from "twin.macro";
import logo from "images/logo-sm.svg";
import { FiMenu, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUserContext } from "pages/users/UserContext";

const MainHeader = tw.div`bg-white`;
const Brand = tw.img`font-bold text-4xl text-green-600 ml-2 p-2 mr-auto`;
const Nav = tw.nav`inline-flex`;
const NavLink = tw(Link)`inline-flex px-4 py-2 hocus:text-green-700`;
const Input = tw.input`border border-green-600 w-96 my-2 p-1.5 px-8 rounded-md bg-opacity-90 hocus:outline-none focus:ring-green-600 focus:border-green-600`;
const Button = tw.button`inline-flex px-4 py-2 mx-2 rounded-md font-bold hover:bg-green-700 bg-green-600 text-white`;
const SearchBar = tw.div`relative mx-auto`;
const SearchIcon = tw(FiSearch)`absolute left-2 inset-y-5`;
const DesktopNav = tw.div`hidden lg:flex items-center justify-between h-16 px-4`;
const MobileNav = tw.div`lg:hidden flex items-center justify-between h-20 shadow-lg px-4 rounded-b-2xl`;

const UserNavbar = () => {

    const { hanldeLogOut } = useUserContext()

    return (
        <MainHeader>
            <DesktopNav>
                <Brand src={logo} alt="DevJobs logo" />
                <SearchBar>
                    <Input
                        type="search"
                        placeholder="Search jobs"
                        autoFocus
                    />
                    <SearchIcon />
                </SearchBar>
                <Nav>
                    <NavLink to="/users/home" tw="text-green-600">Home</NavLink>
                    <NavLink to="">Employer (Post Jobs)</NavLink>
                    <Button onClick={() => hanldeLogOut()}>logout</Button>
                </Nav>
            </DesktopNav>
            <MobileNav>
                <Brand src={logo} alt="DevJobs logo" />
                <FiMenu size={28} tw="m-4" />
            </MobileNav>
        </MainHeader>
    )
}

export default UserNavbar;