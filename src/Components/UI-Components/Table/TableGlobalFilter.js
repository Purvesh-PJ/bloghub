import { Span, SearchIcon, SearchInput } from "./TableGlobalFilter-Style";

export const TableGlobalFilter = ({filter, setFilter}) => {
    return (
        <Span>
            <SearchIcon /> {' '}
            <SearchInput type="text" placeholder="Search..." value={filter || '' } onChange={e => setFilter(e.target.value)} />
        </Span>
    )
}