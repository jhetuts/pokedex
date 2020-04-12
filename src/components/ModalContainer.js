import React, { Component  } from 'react'
import './ModalContainer.scss'

const Pokedex = require('pokeapi-js-wrapper');

const option = {
protocol: 'https',
  versionPath: '/api/v2/',
  cache: true,
  timeout: 5 * 1000 // 5s
}

const P = new Pokedex.Pokedex(option);

class ModalContainer extends Component {
    state = {
        loading: true,
        doneRequest: false,
        pokemon: this.props.pokemon,
        openModal: this.props.openModal,
        pokemonData: '',
        evolutionChain: '',
        evolutionChainData: [],
        species: '',
        abilityDesc: '',
    }

    componentDidMount() {
        this.clearState();
        this.getSpeciesByName(this.props.pokemon);
        this.getPokemon(this.props.pokemon);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pokemon !== this.props.pokemon) {
            this.clearState();
            this.getSpeciesByName(this.props.pokemon);
            this.getPokemon(this.props.pokemon);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.pokemon !== state.pokemon) {
            return {
                openModal: props.openModal,
            };
        }
        return null;
    }

    clearState = () => {
        this.setState({
            loading: true,
            doneRequest: false,
            pokemon: '',
            pokemonData: '',
            evolutionChain: '',
            evolutionChainData: [],
            species: '',
            abilityDesc: ''
        })
    }

    getSpeciesByName = pokemon => {
        P.getPokemonSpeciesByName(pokemon)
        .then(res => {
            if(res) {
                this.setState({
                    loading: false,
                    doneRequest: true,
                    pokemon: pokemon,
                    species: res
                });
            }
            this.getEvolutionChain(res.evolution_chain.url)
        })
        .catch(err => console.log(err));
    }

    getPokemon = pokemon => {
        P.getPokemonByName(pokemon)
        .then(res => {
            this.setState({
                loading: false,
                doneRequest: true,
                pokemonData: res
            });
        })
        .catch(err => console.log(err));
    }

    getAbility = (e, pokemon) => {
        e.preventDefault();
        const abilities = document.querySelectorAll('.ability-name');

        abilities && abilities.forEach(ability => ability.classList.remove('active'));

        e.target.classList.add('active');

        P.getAbilityByName(pokemon)
        .then(res => {
            this.setState({
                abilityDesc: res
            });
        })
        .catch(err => console.log(err));
    }

    getEvolutionChain = url => {
        console.log(url);
        const chainUrl = url.split('/')
        const evoChainId = chainUrl.pop() || chainUrl.pop();

        P.getEvolutionChainById(evoChainId)
        .then(res => {
            this.setState({
                loading: false,
                doneRequest: true,
                evolutionChain: res.chain
            });
        })
        .catch(err => console.log(err));
    }

    checkEvolvesTo = chain => {
        console.log(chain);
        let allDetails = [];

        if(chain.evolves_to.length !== 0) {
            chain.evolves_to.map(evt => {

                const details = {
                    name: '',
                    trigger: '',
                    level: ''
                };

                details.name = evt.species.name;
                if(evt.evolution_details.length !== 0) {
                    evt.evolution_details.map(e => {
                        details.trigger = e.trigger.name;
                        details.level = e.min_level;
                    });
                }
                allDetails.push(details);
                this.checkEvolvesTo(evt);
            });
        }
    }

    getMinHeight = () => {
        if (this.state.doneRequest && !this.state.loading) {
            const bp = document.querySelector('.basic-profile');
            return bp ? bp.getBoundingClientRect().height : 'auto';
        }
        return 'auto';
    }

    closeModal = () => {
        this.setState({
            openModal: !this.state.openModal
        });
    }

    padToThree = num => num <= 999 ? `00${num}`.slice(-3) : num;

    render() {
        let flavoredText,
            pokemonColor,
            pokemonEggGroups,
            pokemonCapturRate,
            pokemonBaseHappiness,
            pokemonHeight,
            pokemonWeight,
            pokemonGeneration,
            pokemonGrowthRate,
            pokemonHabitat,
            pokemonHatchStep,
            pokemonType,
            pokemonAbilities,
            pokemonAbilityDescDesc,
            pokemonEvolvesFrom,
            pokemonEvolutionChain,
            pokemonAllStats;

        const { imgScr, pokemon, pokemonId } = this.props;

        if (this.state.doneRequest && this.state.species && this.state.pokemonData) {
            const { species, evolutionChain, evolutionChainData } = this.state;
            const { stats, height, weight, types, abilities } = this.state.pokemonData;

            console.log(species)
            
            // flavoredText
            flavoredText = species.flavor_text_entries ? species.flavor_text_entries.filter(p => p.language.name === 'en') : 'Loading';
            const randIndex = Math.floor(Math.random() * flavoredText.length);
            flavoredText = flavoredText[randIndex].flavor_text;

            // pokemonColor
            pokemonColor = species.color.name.toUpperCase();

            // eggGropus
            pokemonEggGroups = species.egg_groups.map(egg => egg.name).toString().toUpperCase().replace(',', ', ');

            // Stats
            pokemonAllStats = stats ? stats.map((stat, index) => (
                <p key={index}><span>{stat.stat.name.toUpperCase()}:</span> <span>{stat.base_stat}</span></p>
            )) : <p>Loading</p>;

            // Basic Profile
            pokemonHeight = `${height / 10}m`;
            pokemonWeight = `${weight / 10}kg`;
            pokemonCapturRate = `${species.capture_rate}%`;
            pokemonBaseHappiness = `${species.base_happiness}%`;
            pokemonGeneration = `${species.generation.name.toUpperCase()}`;
            pokemonGrowthRate = `${species.growth_rate.name.toUpperCase()}`;
            pokemonHabitat = `${species.habitat.name.toUpperCase()}`;
            pokemonHatchStep = species.hatch_counter * 250;
            pokemonType = types ? types.map(type => type.type.name).toString().toUpperCase().replace(',', ', ') : 'loading';
            
            // Abilities
            pokemonAbilities = abilities ? abilities.map((ability, index) => 
                    <p className="ability-name" key={index} onClick={(e) => this.getAbility(e, ability.ability.name)}><i>i</i>{ability.ability.name.toUpperCase()}</p>
            ) : 'Loading';

            // Evolution
            const evolvesTo = evolutionChain ? this.checkEvolvesTo(evolutionChain) : 'Loading';
            console.log(evolutionChainData)
            pokemonEvolutionChain = <div className="evolution-chain">
                    {evolutionChain ?
                        <div className="evochain">
                            <img src='#' alt={evolutionChain.species.name} />
                            <span>{evolutionChain ? evolutionChain.species.name.toUpperCase() : 'Loading'}</span>
                        </div>
                    :  'Loading'
                }
            </div>
        }

        if(this.state.abilityDesc) {
            const { abilityDesc } = this.state;
            let effects;

            effects = abilityDesc ? abilityDesc.effect_entries.map((effect, index) => (
                <React.Fragment key={index}>
                    <p><span>Effect: </span><span style={{color: pokemonColor}}>{effect.effect}</span></p>
                    <p><span>Short Effect: </span><span style={{color: pokemonColor}}>{effect.short_effect}</span></p>
                </React.Fragment>
            )) : 'Loading';

            pokemonAbilityDescDesc = effects;
        }

        return (
            <div className={`ModalContainer ${this.state.openModal ? 'active' : null}`} >
                {this.state.loading ? <p>Loading</p> : <div className="ModalContainer-details">
                    <div className="basic-profile">
                        <img style={{ filter: `drop-shadow(30px 10px 4px ${pokemonColor})` }}src={imgScr} alt={pokemon} />
                        <h2>{pokemon.toUpperCase()}
                            <span className="pokemonEggGroups" style={{background: pokemonColor}}>
                                {pokemonEggGroups ? pokemonEggGroups : 'Loading'}
                            </span>
                        </h2>
                        <p>{flavoredText ? flavoredText : 'Loading'}</p>
                    </div>
                    <div className="more-details" style={{maxHeight: this.getMinHeight()}}>
                        <div className="basic-details">
                            <div className="accordion">
                                <div className="accordion-item">
                                    <div className="accordion-details bp-details">
                                        {pokemonAllStats ? pokemonAllStats: 'Loading'}
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h3 className="accordion-title">Basic Profile</h3>
                                    <div className="accordion-details bp-details">
                                        <p>Height: <span>{ pokemonHeight ? pokemonHeight : 'Loading'}</span></p>
                                        <p>Weight: <span>{ pokemonWeight ? pokemonWeight : 'Loading'}</span></p>
                                        <p>Mostly: {pokemonColor ? <span style={{ color: pokemonColor }}>{pokemonColor}</span> : 'Loading'}</p>
                                        <p>Type/s: <span>{ pokemonType ? pokemonType : 'Loading'}</span></p>
                                        <p>Capture rate: <span>{ pokemonCapturRate ? pokemonCapturRate : 'Loading'}</span></p>
                                        <p>Base Happiness: <span>{ pokemonBaseHappiness ? pokemonBaseHappiness : 'Loading'}</span></p>
                                        <p>Generation: <span>{ pokemonGeneration ? pokemonGeneration : 'Loading'}</span></p>
                                        <p>Growth Rate: <span>{ pokemonGrowthRate ? pokemonGrowthRate : 'Loading'}</span></p>
                                        <p>Habitat: <span>{ pokemonHabitat ? pokemonHabitat : 'Loading'}</span></p>
                                        <p>Hatch Step: <span>{ pokemonHatchStep ? pokemonHatchStep : 'Loading'}</span></p>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h3 className="accordion-title">Abilities</h3>
                                    <div className="accordion-details ability-details">
                                        <div className="abilities">
                                            {pokemonAbilities}
                                        </div>
                                        <div className="ability-details">
                                            {pokemonAbilityDescDesc}
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h3 className="accordion-title">Evolution</h3>
                                    <div className="accordion-details">
                                        {pokemonEvolutionChain}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                <span className="close-modal" onClick={this.closeModal}><i></i></span>
            </div>
        )
    }
}
export default ModalContainer;