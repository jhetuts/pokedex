import React, { Component } from 'react'
import PokemonSlider from './PokemonSlider'

class Pokemons extends Component {
    state = {
        limit: 30,
        loading: true,
        pokemonList: []
    };

    componentDidMount() {
        this.loadMore();
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    getList = offset => {
        if (this.props.p) {
            const { p } = this.props;
            const { limit } = this.state;
            p.getPokemonsList({ limit, offset })
            .then(res => {
                if (res) {
                    let oldList = this.state.pokemonList;
                    oldList.push(res.results);

                    this.setState({
                        loading: false,
                        pokemonList: oldList
                    });
                }
            })
            .catch(err => console.log(err));
        }
    }

    loadMore = () => {
        const limit =  this.state.limit * this.state.pokemonList.length;
        this.getList(limit);
    }

    handleScroll = e => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            this.loadMore();
        }
    }

    render() {
        let list;
        if (!this.state.loading) {
            list = this.state.pokemonList.map((list, index) => <PokemonSlider id={`PokemonSlider-${index}`} key={index} pokemons={list} />)
        }

        return (
            <div className="Pokemons" onScroll={this.handleScroll}>
                {list}
            </div>
        )
    }
}
export default Pokemons;