import React, { Component } from 'react';
import PokemonSlider from '../PokemonSlider';

class Generations extends Component {
    state = {
        loading: true,
        generations: '',
        pokemonList: ''
    }

    componentDidMount() {
        this.getGenerations();
    }

    getGenerations = () => {
        const { p } = this.props;
        p.getGenerationsList()
        .then(res => {
            if(res) {
                this.setState({
                    loading: !this.state.loading,
                    generations: res.results
                });

                res.results.map(gen => {
                    p.getGenerationByName(gen.name)
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
                })

            }
        })
    }
    render() {
        let genList;
        if(!this.state.loading) {
            genList = this.state.generations.map(gen => (
                <div key={gen.name} className="Generation">
                    <h2>{gen.name}</h2>
                </div>
            ))
        }
        return (
            <React.Fragment>
                {genList}
            </React.Fragment>
        )
    }
}
export default Generations;