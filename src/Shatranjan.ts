import ShadYantra from './board/ShadYantra';

interface Options {
  switchTurn: boolean;
  variant: string;
}

const Shatranjan = {
  Create({ switchTurn = true, variant = 'shadyantra' } = {} as Options) {
    return new ShadYantra();
  }
};
export default Shatranjan;