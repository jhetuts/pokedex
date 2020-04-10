import React, { Component } from 'react'
import './PokemonSlider.scss';
import LazyLoadImage from '../../../components/LazyLoadImage';

const POKE_API_IMG = 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/';

class PokemonSlider extends Component {
   isDown = false;
   startX = 0;
   scrollLeft = 0;

    padToThree = num => num <= 999 ? `00${num}`.slice(-3) : num;

    handleMouseDown = e => {
        this.isDown = true;
        e.target.classList.add('active');
        this.startX = e.pageX - e.target.offsetLeft;
        this.scrollLeft = e.target.scrollLeft;
    }

    handleMouseLeave = e => {
        this.isDown = false;
        e.target.classList.remove('active');
    }

    hanldeMouseUp = e => {
        this.isDown = false;
        e.target.classList.remove('active');
    }

    handleMouseMove = e => {
        if(!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - e.target.offsetLeft;
        const walk = (x - this.startX) * 3; //scroll-fast
        e.target.scrollLeft = this.scrollLeft - walk;
        console.log(walk);
    }

    render() {
        
        const { pokemons }  = this.props;
        const li = pokemons.map((pokemon, index) => {
            const parts = pokemon.url.split('/')
            const pokeId = parts.pop() || parts.pop();
            return (
                <li key={pokemon.name} url={pokemon.url}>
                    <article>
                        <h3>{pokemon.name}</h3>
                        <LazyLoadImage src={`${POKE_API_IMG}${this.padToThree(pokeId)}.png`} />
                        <span className="shadow"></span>
                    </article>
                </li>
            )
        })
        return (
            <ul
                className="PokemonSlider"
                id={this.props.id}
                onMouseDown={this.handleMouseDown}
                onMouseLeave={this.handleMouseLeave}
                onMouseUp={this.hanldeMouseUp}
                onMouseMove={this.handleMouseMove}
            >
                {li}
            </ul>
        )
    }
}
export default PokemonSlider;