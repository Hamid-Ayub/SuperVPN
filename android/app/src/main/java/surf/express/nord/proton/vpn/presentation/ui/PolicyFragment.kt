package surf.express.nord.proton.vpn.presentation.ui

import android.view.View
import androidx.navigation.fragment.findNavController
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.FragmentPolicyBinding
import surf.express.nord.proton.vpn.presentation.base.BaseFragment

class PolicyFragment : BaseFragment<FragmentPolicyBinding>(R.layout.fragment_policy) {

    override fun initBinding(view: View): FragmentPolicyBinding {
        return FragmentPolicyBinding.bind(view)
    }

    override fun initView() {
        binding.toolbar.apply {
            onBtnLeftClicked = {
                findNavController().popBackStack()
                true
            }
        }
    }
}