import React from 'react'
import InputComponent from '@/components/InputComponent/InputComponent'
import SelectComponent from '@/components/SelectComponent/SelectComponent'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import style from './FilterComponent.module.scss'

export default function FilterComponent(props) {
    const { setSearch, setFilter, setSort, setGalleryMode, search, filter, sort } = props

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'favorites', label: 'Favorites' },
        { value: 'unfavorites', label: 'Unfavorites' },
    ]

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ]
    return (
        <div className={style.FilterComponent}>
        <div className="nav container column">
            <div className="CardComponent">
            <InputComponent 
                label="Search"
                type="text"
                value={search} 
                onChange={setSearch}
            ></InputComponent>
            <SelectComponent 
                label="Filter"
                type="text"
                value={filter} 
                onChange={setFilter}
                options={filterOptions}
            ></SelectComponent>
            <SelectComponent 
                label="Sort"
                type="text"
                value={sort} 
                onChange={setSort}
                options={sortOptions}
            ></SelectComponent>
            <ButtonComponent 
            type="action" 
            onClick={() => setGalleryMode('list')}
            icon="table_rows"
            ></ButtonComponent>
            <ButtonComponent 
            type="action" 
            onClick={() => setGalleryMode('grid')}
            icon="grid_on"
            ></ButtonComponent>
            </div>
        </div>
        </div>
    )
}
