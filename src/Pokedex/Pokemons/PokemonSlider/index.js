import React, { Component } from 'react'
import './PokemonSlider.scss';
import LazyLoadImage from '../../../components/LazyLoadImage';
import ModalContainer from '../../../components/ModalContainer';

const POKE_API_IMG = 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/';

class PokemonSlider extends Component {
    state = {
        openModal: false,
        pokemon: '',
        pokemonId: '',
        imageSrc: '',
    }

    padToThree = num => num <= 999 ? `00${num}`.slice(-3) : num;

    handleClick = (e, pokemonId, name, src) => {
        this.setState({
            openModal: true,
            pokemon: name,
            pokemonId: pokemonId,
            imageSrc: src
        });
    }

    render() {
        const { pokemons }  = this.props;

        const li = pokemons.map(pokemon => {
            const parts = pokemon.url.split('/')
            const pokeId = parts.pop() || parts.pop();
            const imgSrc = `${POKE_API_IMG}${this.padToThree(pokeId)}.png`;

            return (
                <li key={pokemon.name} onClick={(e) => this.handleClick(e, pokeId, pokemon.name, imgSrc)}>
                    <article>
                        <h3>{pokemon.name}</h3>
                        <LazyLoadImage alt={pokemon.name} src={imgSrc} />
                        <span className="shadow"></span>
                    </article>
                </li>
            )
        })
        return (
            <div className="PokemonSlider-wrap">
                <ul className="PokemonSlider" id={this.props.id}>
                    {li}
                </ul>
                {this.state.openModal && 
                <ModalContainer
                    pokemonId={this.props.pokemonId}
                    openModal={this.state.openModal}
                    pokemon={this.state.pokemon}
                    imgScr={this.state.imageSrc} />}
            </div>
        )
    }
}
export default PokemonSlider;